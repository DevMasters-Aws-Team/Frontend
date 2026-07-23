# MCP - Frontend

## Definición
El Frontend no expone MCPs propios directamente, pero consume datos que provienen del protocolo MCP del backend. Este documento define cómo el frontend se integra con el contexto del agente.

## Contexto Expuesto al Agente

### Estado de la UI (WebSocket futuro)
En una versión avanzada, el frontend podría exponer estado de navegación al agente para enriquecer diagnósticos:

```json
{
  "name": "frontend-context",
  "description": "Estado de la UI del dashboard para contextualizar acciones del agente",
  "data": {
    "current_view": "string (dashboard|alerts|services|chaos)",
    "selected_service": "string | null",
    "active_filters": {
      "severity": "string",
      "time_range": "string"
    },
    "user_action": "string (viewing|diagnosing|injecting_chaos)"
  }
}
```

## Integración con Backend MCP

### Flujo de Datos MCP → Frontend

```
CloudWatch MCP (backend)
       │
       ▼ (procesado por backend)
FastAPI Endpoints
       │
       ▼ (HTTP polling / React Query)
Frontend Hooks
       │
       ▼
React Components (render)
```

### Datos que el Frontend consume del MCP:

| Dato MCP | Endpoint Backend | Hook Frontend | Componente |
|----------|-----------------|---------------|------------|
| Logs filtrados | `/api/logs` | useActivityFeed | ActivityFeed |
| Métricas CW | `/api/metrics` | useMetrics | MetricsPanel, Charts |
| Alarmas CW | `/api/alerts` | useAlerts | AlertsTable |
| Knowledge DB | `/api/knowledge` | useKnowledge | KnowledgeBase |
| Diagnósticos | `/api/diagnose` | useDiagnose | TicketDetail |

## Configuración del Frontend para MCP

### API Base Configuration
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para retry en errores de red
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      // Timeout - reintentar
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Environment Variables
```env
# .env.development
VITE_API_URL=http://localhost:8000
VITE_REFRESH_INTERVAL=5000
VITE_WS_URL=ws://localhost:8000/ws

# .env.production
VITE_API_URL=https://api.kiro-monitor.com
VITE_REFRESH_INTERVAL=5000
VITE_WS_URL=wss://api.kiro-monitor.com/ws
```

## Futuro: WebSocket para Tiempo Real

```typescript
// Fase 2: Reemplazar polling con WebSocket
interface WSMessage {
  type: 'metric_update' | 'alert_new' | 'activity_event' | 'service_status';
  payload: unknown;
  timestamp: string;
}

// El backend enviaría eventos en tiempo real via WebSocket
// El frontend actualizaría React Query cache directamente
```
