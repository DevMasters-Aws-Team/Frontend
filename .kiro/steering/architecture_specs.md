# Architecture Specs - Frontend (Dashboard)

## Estructura de Rutas (React Router)

```
/                       → Dashboard principal (métricas + alertas + servicios)
/services               → Lista detallada de microservicios
/services/:id           → Detalle de un microservicio
/alerts                 → Todas las alertas con filtros
/alerts/:id             → Detalle de alerta con request/response
/tickets                → Sistema de tickets
/tickets/:id            → Detalle de ticket
/chaos                  → Panel de Chaos Engineering
/activity               → Timeline completo de actividad de Kiro
/knowledge              → Base de conocimiento de errores
```

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Header.tsx                               │ │
│  │  Logo | Nav Links | Kiro Status Badge | Settings           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────┐  ┌──────────────────────────────────────────┐ │
│  │             │  │           Main Content Area               │ │
│  │  Sidebar    │  │                                          │ │
│  │             │  │  ┌────────┐ ┌────────┐ ┌────────┐       │ │
│  │  • Dashboard│  │  │ Metric │ │ Metric │ │ Metric │       │ │
│  │  • Services │  │  │ Card   │ │ Card   │ │ Card   │       │ │
│  │  • Alerts   │  │  │ Error% │ │ Latency│ │ Uptime │       │ │
│  │  • Tickets  │  │  └────────┘ └────────┘ └────────┘       │ │
│  │  • Chaos    │  │                                          │ │
│  │  • Knowledge│  │  ┌──────────────────────────────────┐   │ │
│  │             │  │  │     AlertsTable.tsx                │   │ │
│  │  ─────────  │  │  │  Severity | Service | Message     │   │ │
│  │             │  │  │  ERROR    | user-svc| Timeout...   │   │ │
│  │  Activity   │  │  └──────────────────────────────────┘   │ │
│  │  Feed       │  │                                          │ │
│  │  ┌────────┐ │  │  ┌──────────────────────────────────┐   │ │
│  │  │ 00:30  │ │  │  │     ServiceStatus.tsx             │   │ │
│  │  │ Alert  │ │  │  │  user-svc ✅ | order-svc ✅       │   │ │
│  │  │ recv'd │ │  │  │  payment-svc ❌ | auth-svc ✅     │   │ │
│  │  ├────────┤ │  │  └──────────────────────────────────┘   │ │
│  │  │ 00:30  │ │  │                                          │ │
│  │  │ Diag-  │ │  │  ┌──────────────────────────────────┐   │ │
│  │  │ nosing │ │  │  │     Charts Area                   │   │ │
│  │  ├────────┤ │  │  │  ErrorRateChart | LatencyChart    │   │ │
│  │  │ 00:30  │ │  │  └──────────────────────────────────┘   │ │
│  │  │ Resol- │ │  │                                          │ │
│  │  │ ved ✅  │ │  └──────────────────────────────────────────┘ │
│  │  └────────┘ │                                                 │
│  └─────────────┘                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Mapeo a Endpoints del Backend

| Componente Frontend | Endpoint Backend | Método | Hook |
|--------------------|-----------------|--------|------|
| MetricsPanel | `/api/metrics` | GET | useMetrics |
| AlertsTable | `/api/alerts` | GET | useAlerts |
| ServiceStatus | `/api/services` | GET | useServices |
| ActivityFeed | `/api/logs` | GET (WebSocket futuro) | useActivityFeed |
| TicketList | `/api/tickets` | GET | useTickets |
| TicketDetail | `/api/tickets/:id` | GET | useTicketDetail |
| ChaosPanel | `/chaos/*` | POST | useChaos |
| KnowledgeBase | `/api/knowledge` | GET | useKnowledge |
| DiagnoseAction | `/api/diagnose` | POST | useDiagnose |
| ResolveAction | `/api/tickets/resolve` | POST | useResolve |

## Estado de la Aplicación

### React Query (Estado Server)
```typescript
// Configuración global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5000,       // Refresh cada 5s
      staleTime: 3000,             // Stale después de 3s
      retry: 2,                    // Reintentar 2 veces
      refetchOnWindowFocus: true,  // Refetch al volver a la ventana
    }
  }
});
```

### Zustand (Estado UI Global)
```typescript
interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  
  // Kiro Agent State
  kiroStatus: 'idle' | 'monitoring' | 'diagnosing' | 'resolving';
  
  // Filters
  selectedService: string | null;
  severityFilter: 'all' | 'ERROR' | 'WARN';
  timeRange: '1h' | '6h' | '24h' | '7d';
  
  // Actions
  toggleSidebar: () => void;
  setKiroStatus: (status: string) => void;
  setFilter: (key: string, value: string) => void;
}
```

## Flujo de Datos en Tiempo Real

```
Backend (FastAPI :8000)
       │
       ▼ (polling cada 5s via React Query)
API Service Layer (axios)
       │
       ▼
Custom Hooks (useMetrics, useAlerts, etc.)
       │
       ▼
React Components (re-render automático)
       │
       ▼
UI actualizada en tiempo real
```

## Responsive Design

| Breakpoint | Layout | Comportamiento |
|------------|--------|----------------|
| < 640px (sm) | 1 columna | Sidebar colapsada, cards apiladas |
| 640-1024px (md) | 2 columnas | Sidebar mini, grid 2 cols |
| > 1024px (lg) | 3 columnas | Sidebar completa, grid 3 cols |
| > 1280px (xl) | Full | Layout completo con activity feed |

## Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
      '/chaos': { target: 'http://localhost:8000', changeOrigin: true }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## Deploy (AWS Amplify)

```
GitHub Push (main branch)
       │
       ▼
AWS Amplify CI/CD
       │
       ├── npm install
       ├── npm run build
       └── Deploy to CDN
              │
              ▼
       https://kiro-dashboard.amplifyapp.com
```
