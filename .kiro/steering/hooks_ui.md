# Hooks UI - Frontend (Custom React Hooks)

## Definición
Custom hooks que encapsulan la lógica de datos y estado para los componentes del dashboard.

## Hooks de Datos (React Query)

### 1. useMetrics
**Propósito:** Obtener métricas globales y por servicio de CloudWatch.

```typescript
interface UseMetricsOptions {
  service?: string;
  metric?: 'error_rate' | 'latency_p99' | 'availability';
  timeRange?: '1h' | '6h' | '24h' | '7d';
  refreshInterval?: number; // ms
}

interface MetricsData {
  errorRate: number;
  latencyP99: number;
  availability: number;
  activeAlerts: number;
  servicesHealthy: number;
  servicesTotal: number;
  history: MetricPoint[];
}

function useMetrics(options?: UseMetricsOptions): {
  data: MetricsData | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}
```

### 2. useAlerts
**Propósito:** Obtener alertas activas con filtros opcionales.

```typescript
interface UseAlertsOptions {
  severity?: 'ERROR' | 'WARN' | 'all';
  service?: string;
  limit?: number;
  enabled?: boolean;
}

interface Alert {
  id: string;
  severity: 'ERROR' | 'WARN';
  service: string;
  endpoint: string;
  statusCode: number;
  message: string;
  traceId: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

function useAlerts(options?: UseAlertsOptions): {
  data: Alert[];
  isLoading: boolean;
  total: number;
  refetch: () => void;
}
```

### 3. useServices
**Propósito:** Obtener estado de todos los microservicios monitoreados.

```typescript
interface Service {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  uptime24h: number;
  lastError?: string;
  errorRate: number;
  latencyP99: number;
}

function useServices(): {
  data: Service[];
  isLoading: boolean;
  healthyCount: number;
  totalCount: number;
  refetch: () => void;
}
```

### 4. useKiroStatus
**Propósito:** Estado actual del agente Kiro (qué está haciendo).

```typescript
type KiroState = 'idle' | 'monitoring' | 'diagnosing' | 'resolving' | 'error';

interface KiroStatus {
  state: KiroState;
  currentAction?: string;
  lastActivity: string;
  uptime: number;
  resolvedToday: number;
  escalatedToday: number;
}

function useKiroStatus(): {
  data: KiroStatus;
  isLoading: boolean;
  isConnected: boolean;
}
```

### 5. useActivityFeed
**Propósito:** Timeline de actividad del agente (pensamiento y acciones).

```typescript
type ActivityType = 
  | 'alert_received'
  | 'diagnosing'
  | 'reading_docs'
  | 'searching_kb'
  | 'auto_resolved'
  | 'escalated'
  | 'skill_executed';

interface ActivityEvent {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  metadata?: {
    service?: string;
    ticketId?: string;
    skill?: string;
    confidence?: number;
  };
}

function useActivityFeed(options?: { maxItems?: number }): {
  events: ActivityEvent[];
  isLoading: boolean;
  latestEvent: ActivityEvent | null;
}
```

### 6. useTickets
**Propósito:** Lista de tickets con estado y filtros.

```typescript
interface Ticket {
  id: string;
  status: 'open' | 'auto_resolved' | 'escalated' | 'closed';
  service: string;
  errorType: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: 'kiro-agent' | 'manual';
  solution?: object;
}

function useTickets(options?: { status?: string }): {
  data: Ticket[];
  isLoading: boolean;
  openCount: number;
  resolvedCount: number;
}
```

## Hooks de Mutación (Acciones)

### 7. useDiagnose
**Propósito:** Ejecutar diagnóstico automático de un error.

```typescript
function useDiagnose(): {
  diagnose: (alertId: string) => Promise<DiagnosisResult>;
  isLoading: boolean;
  lastResult: DiagnosisResult | null;
}

interface DiagnosisResult {
  cause: string;
  confidence: number;
  solution: string;
  isKnown: boolean;
  relatedTickets: string[];
}
```

### 8. useChaos
**Propósito:** Inyectar fallos via Chaos Engineering endpoints.

```typescript
type ChaosType = 'timeout' | 'error500' | 'error503' | 'memory' | 'cascade';

function useChaos(): {
  inject: (type: ChaosType, service: string) => Promise<ChaosResult>;
  isInjecting: boolean;
  lastInjection: ChaosResult | null;
}

interface ChaosResult {
  success: boolean;
  type: ChaosType;
  service: string;
  timestamp: string;
  expectedDetectionTime: number; // ms
}
```

### 9. useResolveTicket
**Propósito:** Auto-resolver un ticket desde el dashboard.

```typescript
function useResolveTicket(): {
  resolve: (ticketId: string) => Promise<ResolveResult>;
  isResolving: boolean;
}

interface ResolveResult {
  status: 'auto_resolved' | 'failed';
  ticketId: string;
  solution?: object;
  message: string;
}
```

## Hooks de UI

### 10. useRefreshInterval
**Propósito:** Controlar el intervalo de refresh de datos.

```typescript
function useRefreshInterval(defaultMs?: number): {
  interval: number;
  setInterval: (ms: number) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}
```

### 11. useTimeRange
**Propósito:** Controlar el rango de tiempo seleccionado para gráficos.

```typescript
function useTimeRange(): {
  range: '1h' | '6h' | '24h' | '7d';
  setRange: (range: string) => void;
  startTime: Date;
  endTime: Date;
}
```
