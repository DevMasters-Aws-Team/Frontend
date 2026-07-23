# Guía de Implementación de Servicios AWS - Frontend

## Estado Actual vs Objetivo

```
ESTADO ACTUAL (Mock/Dev)                OBJETIVO (AWS Real)
────────────────────────                ────────────────────
Login mock (cualquier email)    →       AWS Cognito (Hosted UI o Amplify)
API via proxy Vite              →       API Gateway / ALB directo
Deploy manual                   →       AWS Amplify Hosting (CI/CD auto)
Sin variables seguras           →       Variables en Amplify Console
```

---

## 1. AWS Cognito (Autenticación)

### Qué reemplaza
- `src/pages/LoginPage.jsx` → login mock que acepta cualquier credencial
- `src/stores/appStore.js` → estado de auth sin validación real

### Prerequisitos en AWS
1. User Pool creado (desde `kiro-agent/terraform/cognito.tf`)
2. App Client configurado con OAuth2/OIDC
3. Dominio de Cognito configurado (ej: `kiro-auth.auth.us-east-1.amazoncognito.com`)

### Datos necesarios del equipo de infra
| Dato | Variable de Entorno | Dónde obtener |
|------|-------------------|---------------|
| User Pool ID | `VITE_COGNITO_USER_POOL_ID` | Cognito Console → User Pool → General settings |
| App Client ID | `VITE_COGNITO_CLIENT_ID` | Cognito Console → App clients |
| Dominio Cognito | `VITE_COGNITO_DOMAIN` | Cognito Console → Domain name |
| Region | `VITE_AWS_REGION` | La misma del proyecto (`us-east-1`) |
| Redirect URL | `VITE_COGNITO_REDIRECT_URI` | URL de tu frontend (localhost o Amplify) |

### Opción A: Cognito Hosted UI (más rápido, recomendado para hackathon)

No requiere librería. Solo un redirect a la URL de Cognito:

**Archivo a modificar:** `src/pages/LoginPage.jsx`

```jsx
// Reemplazar el handleSubmit mock por:
const handleLogin = () => {
  const domain = import.meta.env.VITE_COGNITO_DOMAIN
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
  const redirectUri = encodeURIComponent(import.meta.env.VITE_COGNITO_REDIRECT_URI || window.location.origin)
  
  window.location.href = 
    `https://${domain}/login?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`
}
```

**Archivo nuevo:** `src/pages/CallbackPage.jsx` (para recibir el token)

```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores/appStore'

export default function CallbackPage() {
  const login = useAppStore((s) => s.login)
  const navigate = useNavigate()

  useEffect(() => {
    // Cognito devuelve el token en el hash de la URL
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const idToken = params.get('id_token')
    const accessToken = params.get('access_token')

    if (idToken) {
      // Decodificar JWT para obtener el email
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      login({ email: payload.email, name: payload.name || payload.email, token: accessToken })
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return <div className="flex items-center justify-center h-screen text-white">Autenticando...</div>
}
```

**Agregar ruta en `App.jsx`:**
```jsx
<Route path="/callback" element={<CallbackPage />} />
```

**Configurar en Cognito Console:**
- Callback URL: `http://localhost:5173/callback` (dev) y `https://tu-dominio.amplifyapp.com/callback` (prod)
- Sign out URL: `http://localhost:5173/login`
- OAuth flows: Implicit grant
- Scopes: openid, email, profile

### Opción B: AWS Amplify Auth (más control, más código)

```bash
npm install aws-amplify @aws-amplify/ui-react
```

**Archivo nuevo:** `src/services/auth.js`
```js
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [window.location.origin + '/callback'],
          redirectSignOut: [window.location.origin + '/login'],
          responseType: 'token',
        }
      }
    }
  }
})
```

### Variables de entorno (.env)
```env
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=kiro-auth.auth.us-east-1.amazoncognito.com
VITE_COGNITO_REDIRECT_URI=http://localhost:5173/callback
VITE_AWS_REGION=us-east-1
```

---

## 2. AWS Amplify Hosting (Deploy)

### Qué reemplaza
- Ejecutar `npm run dev` localmente
- No tener URL pública

### Pasos para desplegar

#### Paso 1: Conectar repo a Amplify
1. Ir a AWS Console → Amplify
2. "Host web app" → Conectar GitHub
3. Seleccionar repo `DevMasters-Aws-Team/Frontend`
4. Branch: `main` (o `develop`)

#### Paso 2: Build Settings
Amplify auto-detecta Vite. Confirmar que el `amplify.yml` sea:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Paso 3: Variables de entorno en Amplify Console
En Amplify → App settings → Environment variables, agregar:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://api.tu-dominio.com` (URL del backend/ALB) |
| `VITE_COGNITO_USER_POOL_ID` | `us-east-1_XXXXXXX` |
| `VITE_COGNITO_CLIENT_ID` | `xxxxxxxxxxxx` |
| `VITE_COGNITO_DOMAIN` | `kiro-auth.auth.us-east-1.amazoncognito.com` |
| `VITE_COGNITO_REDIRECT_URI` | `https://main.xxxxx.amplifyapp.com/callback` |

#### Paso 4: Rewrites para SPA
En Amplify → App settings → Rewrites and redirects, agregar:

| Source | Target | Type |
|--------|--------|------|
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|woff2\|ttf\|map\|json)$)([^.]+$)/>` | `/index.html` | 200 (Rewrite) |

Esto permite que React Router maneje las rutas sin 404.

#### Paso 5: Dominio personalizado (opcional)
- Amplify → Domain management → Add domain
- Usar Route 53 o DNS externo

---

## 3. Conexión al Backend en Producción

### Qué reemplaza
- Proxy de Vite (`localhost:8080`) que solo funciona en dev

### En producción
El frontend ya no usa proxy. Las llamadas van directo a la URL del backend:

**Archivo:** `src/services/api.js`
```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',  // ← en prod será la URL del ALB/API Gateway
})
```

**Variable de entorno en Amplify:**
```
VITE_API_URL=https://kiro-backend-alb-xxxx.us-east-1.elb.amazonaws.com
```

### CORS en el Backend
El backend ya tiene CORS configurado. Solo agregar la URL de Amplify:
```env
# backend/.env
CORS_ORIGINS=["http://localhost:5173","https://main.xxxxx.amplifyapp.com"]
```

---

## 4. Resumen: Orden de Implementación

| Prioridad | Tarea | Archivo a modificar | Impacto |
|-----------|-------|--------------------:|---------|
| 🔴 1 | **Cognito Hosted UI** | `LoginPage.jsx` + nueva `CallbackPage.jsx` + `App.jsx` | Login real con AWS |
| 🟡 2 | **Deploy Amplify** | Configuración en AWS Console (no código) | URL pública funcional |
| 🟡 3 | **Variables de prod** | `.env` en Amplify Console | Conectar frontend → backend real |
| 🟢 4 | **Amplify Auth** (opcional) | `services/auth.js` + `package.json` | Más control sobre el flujo auth |

---

## 5. Checklist Pre-Demo

- [ ] User Pool de Cognito creado con App Client
- [ ] Variables VITE_COGNITO_* configuradas
- [ ] Callback URL registrada en Cognito (`/callback`)
- [ ] Frontend desplegado en Amplify
- [ ] CORS del backend incluye URL de Amplify
- [ ] Rewrite rule configurada en Amplify (SPA)
- [ ] Login funciona con usuario real de Cognito
- [ ] Dashboard muestra datos del backend
- [ ] Chat responde con diagnósticos
- [ ] Chaos Engineering inyecta fallos visibles
