# Components Spec - Frontend (Dashboard)

## Componentes del Dashboard

### 1. MetricsPanel
**Propósito:** Panel principal con tarjetas de métricas clave en tiempo real.

```tsx
interface MetricsPanelProps {
  refreshInterval?: number; // ms, default 5000
}

// Tarjetas mostradas:
// - Error Rate (%) → Rojo si > 5%
// - Latency P99 (ms) → Amarillo si > 500ms
// - Uptime (%) → Verde si > 99.9%
// - Active Alerts (count) → Badge con número
// - Tickets Open (count) → Badge con número
// - Services Healthy (n/total) → Progreso visual
```

### 2. AlertsTable
**Propósito:** Tabla interactiva de alertas activas con filtros y sorting.

```tsx
interface AlertsTableProps {
  limit?: number;
  serviceFilter?: string;
  severityFilter?: 'ERROR' | 'WARN' | 'all';
}

// Columnas:
// - Severity (badge color)
// - Service (nombre del microservicio)
// - Endpoint (ruta HTTP)
// - Status Code (500, 401, 503)
// - Message (truncado)
// - Time (relative con date-fns)
// - Actions (Diagnose | View)
```

### 3. ServiceStatus
**Propósito:** Grid visual con el estado de cada microservicio monitoreado.

```tsx
interface ServiceStatusProps {
  services: Service[];
}

// Cada servicio muestra:
// - Nombre del servicio
// - Indicador: ✅ Healthy | ⚠️ Degraded | ❌ Down
// - Último error (si existe)
// - Uptime últimas 24h
// - Botón: "View Details"
```

### 4. ActivityFeed (Timeline de Kiro)
**Propósito:** Timeline en tiempo real del pensamiento y acciones del agente.

```tsx
interface ActivityFeedProps {
  maxItems?: number; // default 20
  autoScroll?: boolean;
}

// Tipos de eventos:
// - 🔔 Alert Received (azul)
// - 🔍 Diagnosing (amarillo)  
// - 📖 Reading Docs (indigo)
// - 🔎 Searching Knowledge Base (púrpura)
// - ✅ Auto-Resolved (verde)
// - ⚠️ Escalated (naranja)
// - 🛠️ Skill Executed (gris)
```

### 5. ChaosPanel
**Propósito:** Panel para que el jurado inyecte fallos con un clic.

```tsx
interface ChaosPanelProps {
  services: Service[];
}

// Botones de Chaos:
// - 💥 Inject Timeout (simula DB timeout)
// - 🔴 Force 500 Error (error interno)
// - 🚫 Service Unavailable (503)
// - 💾 Memory Leak (simula)
// - 🌊 Cascade Failure (fallo en cadena)
//
// Cada botón:
// - Selector de servicio target
// - Confirmación antes de ejecutar
// - Indicador de que el fallo fue inyectado
// - Timer hasta que Kiro lo detecte y resuelva
```

### 6. ErrorRateChart
**Propósito:** Gráfico de línea temporal con tasa de errores por servicio.

```tsx
interface ErrorRateChartProps {
  services: string[];
  timeRange: '1h' | '6h' | '24h' | '7d';
}

// Recharts LineChart
// - Eje X: Tiempo
// - Eje Y: Error Rate (%)
// - Líneas: Una por servicio (colores distintos)
// - Tooltip: Detalle al hover
// - Referencia: Línea roja en 5% (umbral)
```

### 7. LatencyChart
**Propósito:** Gráfico de latencia P99 por servicio.

```tsx
interface LatencyChartProps {
  services: string[];
  timeRange: '1h' | '6h' | '24h' | '7d';
}

// Recharts AreaChart
// - Eje X: Tiempo
// - Eje Y: Latencia (ms)
// - Áreas: P50 (verde), P95 (amarillo), P99 (rojo)
// - Referencia: Línea en 500ms (umbral)
```

### 8. TicketDetail
**Propósito:** Vista detallada de un ticket con request/response fallido.

```tsx
interface TicketDetailProps {
  ticketId: string;
}

// Secciones:
// - Header: ID, Status, Severity, Timestamp
// - Request Fallido: Method, URL, Headers, Body
// - Response Fallido: Status, Body (JSON formatted)
// - Diagnóstico: Causa, Confianza, Solución sugerida
// - Timeline: Eventos del ticket
// - Actions: Auto-Resolve | Escalate | Close
```

### 9. KnowledgeBase
**Propósito:** Vista de la base de conocimiento de errores registrados.

```tsx
interface KnowledgeBaseProps {
  searchable?: boolean;
}

// Lista de errores conocidos:
// - Error Type
// - Servicio afectado
// - Solución almacenada
// - Confianza (%)
// - Ocurrencias
// - Última vez visto
// - Acción: Editar solución
```

### 10. Header
**Propósito:** Barra superior con estado del agente y navegación.

```tsx
// Elementos:
// - Logo Kiro
// - Nav: Dashboard | Services | Alerts | Tickets | Chaos
// - Kiro Status Badge:
//   - 🟢 Idle (monitoreando)
//   - 🟡 Diagnosing (analizando)
//   - 🔵 Resolving (ejecutando skill)
//   - 🔴 Error (agente con problemas)
// - Settings icon
```

## Componentes Compartidos (UI Kit)

| Componente | Uso |
|------------|-----|
| `Badge` | Severidad, estado, conteo |
| `Card` | Container para métricas/info |
| `Skeleton` | Loading state placeholder |
| `StatusIndicator` | Punto de color (health) |
| `TimeAgo` | Tiempo relativo "hace 5m" |
| `JsonViewer` | Mostrar JSON formateado |
| `ConfirmDialog` | Confirmación antes de Chaos |
| `EmptyState` | Cuando no hay datos |
| `ErrorBoundary` | Captura errores React |
