# Global Steering - Frontend (Kiro Monitor Dashboard)

## Rol del Repositorio
Dashboard de observabilidad con 3 secciones principales:
1. **Login** — Autenticación con AWS Cognito
2. **Chat con Kiro** — Interfaz conversacional tipo Gemini para interactuar con el agente
3. **Dashboards** — Métricas, alertas, estado de servicios, chaos engineering

## Stack Tecnológico
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Lenguaje:** JavaScript (JSX)
- **Estilos:** TailwindCSS 4
- **Gráficos:** Recharts
- **Estado Server:** @tanstack/react-query 5
- **Estado Global:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router DOM 7
- **Iconos:** Lucide React
- **Fechas:** date-fns
- **Package Manager:** pnpm
- **Linter:** oxlint

## Estructura de Archivos
```
src/
├── App.jsx                      # Root con Router
├── main.jsx                     # Entry point
├── components/
│   ├── Layout/
│   │   ├── AppLayout.jsx        # Layout principal (header + sidebar + content)
│   │   ├── Header.jsx           # Header con estado del agente
│   │   └── Sidebar.jsx          # Navegación lateral
│   ├── Dashboard/
│   │   ├── MetricsPanel.jsx     # Tarjetas de métricas clave
│   │   ├── AlertsTable.jsx      # Tabla de alertas activas
│   │   ├── ServiceStatus.jsx    # Grid de estado de servicios
│   │   └── ActivityFeed.jsx     # Timeline del agente Kiro
│   ├── Chat/
│   │   ├── ChatPanel.jsx        # Interfaz de chat principal
│   │   ├── ChatMessage.jsx      # Burbuja de mensaje
│   │   └── ChatInput.jsx        # Input de texto + enviar
│   ├── Chaos/
│   │   ├── ChaosPanel.jsx       # Panel de Chaos Engineering
│   │   └── ChaosButton.jsx      # Botón para inyectar fallo
│   └── Auth/
│       └── LoginForm.jsx        # Formulario de login (Cognito)
├── pages/
│   ├── LoginPage.jsx            # Página de login
│   ├── DashboardPage.jsx        # Página principal dashboard
│   ├── ChatPage.jsx             # Página del chat con Kiro
│   └── ChaosPage.jsx            # Página de Chaos Engineering
├── hooks/
│   ├── useMetrics.js            # Hook para métricas
│   ├── useAlerts.js             # Hook para alertas
│   ├── useServices.js           # Hook para servicios
│   └── useChat.js               # Hook para el chat con el agente
├── services/
│   └── api.js                   # Axios instance + endpoints
├── stores/
│   └── appStore.js              # Zustand store (auth, sidebar, filters)
├── styles/
│   └── index.css                # TailwindCSS imports + custom vars
└── utils/
    └── constants.js             # URLs, colores, config
```

## Diseño UI/UX

### Tema: Dark Mode (SRE/Monitoreo)
- Fondo principal: slate-900 (#0F172A)
- Tarjetas: slate-800 (#1E293B)
- Texto: slate-50 (#F8FAFC)
- Acento: blue-500 (#3B82F6)
- Success: emerald-500 (#10B981)
- Warning: amber-500 (#F59E0B)
- Error: red-500 (#EF4444)

### Convenciones React
- Functional components exclusivamente
- Custom hooks para lógica reutilizable
- React Query para datos del servidor
- Zustand para estado UI (auth, sidebar)
- Axios para HTTP

### Páginas
1. `/login` — Login con Cognito (o mock para dev)
2. `/` — Dashboard principal (métricas + alertas + servicios)
3. `/chat` — Chat conversacional con el agente Kiro
4. `/chaos` — Panel de Chaos Engineering
