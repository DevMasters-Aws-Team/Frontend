# Kiro Monitor Agent - Frontend Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

**Dashboard de Observabilidad + Chat con el Agente Kiro**

</div>

---

## 🚀 Quick Start (3 comandos)

### Prerequisitos
- Node.js 18+ ([descargar](https://nodejs.org/))
- pnpm (`npm install -g pnpm`) o npm

### Levantar el proyecto

```bash
# 1. Clonar
git clone https://github.com/DevMasters-Aws-Team/Frontend.git
cd Frontend

# 2. Instalar dependencias
pnpm install

# 3. Levantar
pnpm dev
```

**¡Listo!** Abre http://localhost:5173

> **Nota:** El backend debe estar corriendo en http://localhost:8080 para que los datos funcionen.

---

## 📱 Funcionalidades

### 🔐 Login (Cognito)
- Formulario de autenticación
- **En desarrollo:** Login mock — pon cualquier email y contraseña para entrar
- **En producción:** AWS Cognito Hosted UI (ver `Docs/GUIA_IMPLEMENTACION_SERVICIOS.md`)
- Ruta protegida: sin login no hay acceso al dashboard

### 💬 Chat con Kiro (tipo Gemini)
- Interfaz conversacional
- Pregunta al agente sobre errores, diagnósticos, estado de servicios
- Respuestas con diagnóstico estructurado
- Animación de "escribiendo..."

### 📊 Dashboard
- Métricas en tiempo real (error rate, latencia, disponibilidad)
- Estado de microservicios (healthy/degraded/down)
- Tabla de alertas activas con timestamps relativos
- Auto-refresh cada 5 segundos

### ⚡ Chaos Engineering
- Botones para inyectar fallos en microservicios
- Selector de servicio target
- Historial de inyecciones
- Tipos: timeout, error 500, error 503, cascade failure

---

## 🏗️ Estructura

```
src/
├── App.jsx                          # Router + rutas protegidas
├── main.jsx                         # Entry + React Query + Router providers
├── components/
│   ├── Layout/                      # AppLayout, Header, Sidebar
│   ├── Dashboard/                   # MetricsPanel, ServiceStatus, AlertsTable
│   └── Chat/                        # (futuro) ChatPanel, ChatMessage
├── pages/
│   ├── LoginPage.jsx                # Login con Cognito (mock)
│   ├── DashboardPage.jsx            # Métricas + Servicios + Alertas
│   ├── ChatPage.jsx                 # Chat conversacional con Kiro
│   └── ChaosPage.jsx                # Panel de Chaos Engineering
├── services/
│   └── api.js                       # Axios + todos los endpoints
├── stores/
│   └── appStore.js                  # Zustand (auth, sidebar, kiroStatus)
└── styles/
    └── index.css                    # TailwindCSS + custom theme
```

---

## ⚙️ Configuración

Crea un `.env` si necesitas apuntar a otro backend:

```env
VITE_API_URL=http://localhost:8080
```

Si no creas `.env`, el proxy de Vite redirige `/api` y `/chaos` al puerto 8080 automáticamente.

---

## 🚀 Deploy (AWS Amplify)

1. Conectar este repo a AWS Amplify Hosting
2. Branch: `main`
3. Amplify auto-detecta Vite y compila
4. Agregar variables de entorno en Amplify Console:
   - `VITE_API_URL` = URL del backend (ALB)
   - `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`

Ver guía completa en **`Docs/GUIA_IMPLEMENTACION_SERVICIOS.md`**

---

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| `Docs/GUIA_IMPLEMENTACION_SERVICIOS.md` | Cognito, Amplify, deploy, paso a paso |
| `.kiro/steering/global_steering.md` | Convenciones y stack |
| `.kiro/steering/components.md` | Spec de componentes |
| `.kiro/steering/hooks_ui.md` | Custom hooks |

---

## 👥 Equipo (DevMasters AWS Team)

<table>
<tr>
<td align="center"><sub><b>Ashley Zifrikc Villanueva</b></sub></td>
<td align="center"><sub><b>Julio Vargas</b></sub></td>
<td align="center"><sub><b>Jennifer Nicole Solis</b></sub></td>
<td align="center"><sub><b>Juan Aulla Solis</b></sub></td>
<td align="center"><sub><b>Jesus</b></sub></td>
</tr>
</table>

---

<div align="center">

**Desarrollado con ❤️ por DevMasters AWS Team**

[![Agent](https://img.shields.io/badge/🔗%20Agent-Repo-blue?style=for-the-badge)](https://github.com/DevMasters-Aws-Team/kiro-sre-Monitor-Agent/)
[![Backend](https://img.shields.io/badge/🔗%20Backend-Repo-green?style=for-the-badge)](https://github.com/DevMasters-Aws-Team/Backend)
[![Frontend](https://img.shields.io/badge/🔗%20Frontend-Repo-61DAFB?style=for-the-badge)](https://github.com/DevMasters-Aws-Team/Frontend)

</div>
