# Kiro SRE - Frontend (Dashboard UI)

<div align="center">

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Dashboard de Visualización y Monitoreo del Agente Autónomo Kiro**

</div>

---

El **Frontend (Dashboard)** es una aplicación web moderna desarrollada con **React y Vite** que actúa como la ventana de visibilidad del ecosistema. Su objetivo es proporcionar a los ingenieros de DevOps y SRE una interfaz gráfica en tiempo real donde pueden observar las anomalías, el estado de los microservicios simulados y, lo más importante, las decisiones y acciones de auto-remediación tomadas por el Agente Kiro.

## 📋 Descripción

Este repositorio contiene la interfaz de usuario. Al igual que el Backend, este proyecto forma parte de la arquitectura de la Hackathon y sirve para validar visualmente la capacidad resolutiva del Agente SRE. La plataforma incluye:

- **Panel de Observabilidad:** Gráficos y tablas en tiempo real con datos de latencia, tráfico y errores.
- **Log de Incidentes:** Historial de alarmas disparadas por EventBridge y CloudWatch.
- **Kiro's Activity Feed:** Línea de tiempo visualizando cuándo Kiro lee un log, toma una decisión y ejecuta un "Skill" (Lambda).
- **Simulador de Caos:** Botones en la UI que disparan directamente los endpoints de Chaos del Backend para probar al agente.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| React 18 | Librería principal de interfaces |
| Vite 5 | Bundler y entorno de desarrollo ultra-rápido |
| TypeScript 5.3 | Tipado estático para mayor mantenibilidad |
| TailwindCSS 3.4 | Estilos utilitarios (dark mode por defecto) |
| Recharts 2.12 | Visualización de datos y métricas |
| @tanstack/react-query 5 | Estado de servidor con auto-refresh |
| Zustand 4.5 | Estado global de UI ligero |

### **Dependencias Principales**:
- **react-router-dom** - Enrutamiento de páginas
- **axios** - Cliente HTTP para consumir la API del Backend
- **@tanstack/react-query** - Cache y sincronización de datos server
- **zustand** - Estado UI global (filtros, sidebar, theme)
- **recharts** - Gráficos de métricas (error rate, latencia)
- **lucide-react** - Iconos
- **date-fns** - Formateo de fechas relativas
- **eslint** + **prettier** - Análisis estático y formateo

----

## 📦 Requisitos Previos

- Node.js 18 o superior
- npm (o yarn/pnpm)
- Docker (Opcional, para ejecución en contenedores)
- Acceso a la API del Backend ejecutándose localmente

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/DevMasters-Aws-Team/Frontend.git
cd Frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:
```bash
npm run dev
```

*La aplicación se abrirá por defecto en `http://localhost:5173`.*

---

## ⚙️ Configuración

### Variables de Entorno

La aplicación utiliza variables de entorno (archivo `.env`) para la configuración:

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del Backend API | `http://localhost:8000` |
| `VITE_REFRESH_INTERVAL` | Intervalo de refresh de datos (ms) | `5000` |
| `VITE_COGNITO_USER_POOL_ID` | Cognito User Pool ID | — |
| `VITE_COGNITO_APP_CLIENT_ID` | Cognito App Client ID | — |

---

## 🏗️ Estructura del Proyecto y Metodología (Bootcamp)

Siguiendo el flujo **Specs Driven Development (SDD)**, antes de escribir los componentes en React, el equipo define el diseño, la lógica y los *hooks* en archivos `.md` dentro de la carpeta `.kiro/` para que la IA programe en modo *Supervised*:

```text
Frontend/
├── 📂 .kiro/steering/                # Fase de Setup / SDD (Definiciones en Markdown)
│   ├── global_steering.md            # Convenciones React/TS, paleta dark mode, accesibilidad AA
│   ├── architecture_specs.md         # Rutas, diagrama componentes, estado React Query/Zustand
│   ├── components.md                 # Spec de componentes: MetricsPanel, AlertsTable, ChaosPanel, ActivityFeed
│   ├── hooks_ui.md                   # Custom Hooks: useMetrics, useAlerts, useKiroStatus, useChaos
│   └── mcp.md                        # Integración con backend MCP, configuración API
│
├── 📂 src/                           # ⚙️ Código Fuente
│   ├── 📂 components/                # Componentes React (Dashboard, Charts, Chaos, Tickets, Layout)
│   ├── 📂 hooks/                     # Custom Hooks de React
│   ├── 📂 services/                  # API services (axios)
│   ├── 📂 stores/                    # Zustand stores (estado UI global)
│   ├── 📂 types/                     # TypeScript interfaces
│   ├── 📂 utils/                     # Formatters y constantes
│   ├── App.tsx                       # Root component con Router
│   └── main.tsx                      # Entry point
│
├── index.html
├── package.json                      # Dependencies + scripts
├── vite.config.ts                    # Vite config + proxy a backend
├── tailwind.config.js                # TailwindCSS config (dark mode)
├── tsconfig.json
└── Dockerfile                        # Multi-stage build (Vite → Nginx)
```

---

## 🔧 Desarrollo y Pruebas (Construir en Equipo + PRs)

El desarrollo del Dashboard colaborativo funciona así:

1. El Agente (Kiro) lee los `.md` en `.kiro/` para entender el sistema de diseño y las rutas.
2. Trabaja en tu rama de `feat/nombre-componente`.
3. Kiro trabajará en modo **Supervised** generando los componentes en `src/components/`.
4. Al terminar, el **Git Hook** de pre-commit validará el linting y los tests de UI de forma automática.
5. Genera el mensaje de commit con IA, haz *push* y abre un PR describiendo los cambios basados en el spec.

### Comandos manuales:
```bash
# Formatear código
npm run format

# Pasar linter
npm run lint

# Correr tests de UI
npm run test
```

---

## 🚀 Despliegue (Docker)

El proyecto incluye un `Dockerfile` multietapa (multi-stage) que compila la aplicación con Vite y la sirve usando un servidor Nginx ligero y optimizado para producción.

```bash
# Construir imagen
docker build -t kiro-frontend-ui .

# Ejecutar contenedor
docker run -p 80:80 kiro-frontend-ui
```

---

## 👥 Equipo (DevMasters AWS Team)

<table>
<tr>
<td align="center" width="150">
<sub><b>Ashley Zifrikc Villanueva</b></sub><br />
<a href="#"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="#"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
</td>
<td align="center" width="150">
<sub><b>Julio Vargas</b></sub><br />
<a href="#"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="#"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
</td>
<td align="center" width="150">
<sub><b>Jennifer Nicole Solis</b></sub><br />
<a href="#"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="#"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
</td>
<td align="center" width="150">
<sub><b>Juan Aulla Solis</b></sub><br />
<a href="#"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="#"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
</td>
<td align="center" width="150">
<sub><b>Jesus</b></sub><br />
<a href="#"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="#"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
</td>
</tr>
</table>

---

## 📄 Licencia

Este proyecto es desarrollado para la Hackathon.

---

<div align="center">

**Desarrollado con ❤️ por DevMasters AWS Team**

</div>
