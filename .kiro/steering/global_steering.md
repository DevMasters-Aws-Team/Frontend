# Global Steering - Frontend (Kiro Monitor Dashboard)

## Stack Tecnológico
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Lenguaje:** TypeScript 5.3+
- **Estilos:** TailwindCSS 3.4
- **Gráficos:** Recharts 2.12
- **Estado Server:** @tanstack/react-query 5
- **Estado Global:** Zustand 4.5
- **HTTP Client:** Axios 1.6
- **Routing:** React Router DOM 6.22
- **Iconos:** Lucide React
- **Fechas:** date-fns

## Convenciones de React

### Estructura de Archivos
```
src/
├── App.tsx                      # Root component con Router
├── main.tsx                     # Entry point
├── components/
│   ├── Dashboard/
│   │   ├── MetricsPanel.tsx     # Panel principal de métricas
│   │   ├── AlertsTable.tsx      # Tabla de alertas activas
│   │   ├── ServiceStatus.tsx    # Estado de microservicios
│   │   └── ActivityFeed.tsx     # Timeline de actividad de Kiro
│   ├── Charts/
│   │   ├── ErrorRateChart.tsx   # Gráfico de error rate
│   │   ├── LatencyChart.tsx     # Gráfico de latencia P99
│   │   └── AvailabilityChart.tsx # Gráfico de disponibilidad
│   ├── Chaos/
│   │   ├── ChaosPanel.tsx       # Panel de Chaos Engineering
│   │   └── ChaosButton.tsx      # Botones para inyectar fallos
│   ├── Tickets/
│   │   ├── TicketList.tsx       # Lista de tickets
│   │   └── TicketDetail.tsx     # Detalle con request/response
│   └── Layout/
│       ├── Header.tsx           # Header con estado del agente
│       ├── Sidebar.tsx          # Navegación lateral
│       └── Footer.tsx           # Footer con versión
├── hooks/
│   ├── useMetrics.ts            # Hook para métricas CloudWatch
│   ├── useAlerts.ts             # Hook para alertas
│   ├── useServices.ts           # Hook para estado de servicios
│   ├── useKiroStatus.ts         # Hook para estado del agente Kiro
│   └── useActivityFeed.ts       # Hook para timeline de actividad
├── services/
│   ├── api.ts                   # Axios instance configurada
│   ├── metricsService.ts        # Servicio de métricas
│   ├── alertsService.ts         # Servicio de alertas
│   └── chaosService.ts          # Servicio de Chaos Engineering
├── stores/
│   └── appStore.ts              # Zustand store global
├── types/
│   ├── metrics.ts               # Tipos de métricas
│   ├── alerts.ts                # Tipos de alertas
│   ├── services.ts              # Tipos de servicios
│   └── tickets.ts               # Tipos de tickets
├── utils/
│   ├── formatters.ts            # Formateo de datos
│   └── constants.ts             # Constantes de la app
└── styles/
    └── globals.css              # TailwindCSS base styles
```

### Reglas de Código TypeScript/React
1. **Functional components** exclusivamente (no class components)
2. **Type annotations** obligatorias en props, hooks y funciones
3. **Interface** para props de componentes (prefijo: sin I)
4. **Custom hooks** para toda lógica reutilizable
5. **React Query** para estado de servidor (no useState para datos remotos)
6. **Zustand** solo para estado UI global (theme, sidebar, etc.)
7. **Desestructuración** de props en la firma del componente
8. **Nombrado:** PascalCase para componentes, camelCase para funciones/hooks

### Patrón de Componente
```tsx
// Patrón estándar para componentes
interface MetricsPanelProps {
  services: Service[];
  refreshInterval?: number;
}

export function MetricsPanel({ services, refreshInterval = 5000 }: MetricsPanelProps) {
  const { data, isLoading } = useMetrics({ refreshInterval });
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* contenido */}
    </div>
  );
}
```

## Diseño UI/UX

### Paleta de Colores
```css
/* Colores principales */
--kiro-primary: #2563EB;       /* Azul principal */
--kiro-success: #10B981;       /* Verde - servicio OK */
--kiro-warning: #F59E0B;       /* Amarillo - WARN */
--kiro-error: #EF4444;         /* Rojo - ERROR/Critical */
--kiro-info: #6366F1;          /* Indigo - Info */

/* Fondos */
--bg-primary: #0F172A;         /* Dark slate (modo oscuro) */
--bg-secondary: #1E293B;       /* Tarjetas */
--bg-tertiary: #334155;        /* Hover states */

/* Texto */
--text-primary: #F8FAFC;       /* Texto principal */
--text-secondary: #94A3B8;     /* Texto secundario */
```

### Tema Visual
- **Modo:** Dark mode por defecto (tema de monitoreo/SRE)
- **Tipografía:** Inter / system-ui
- **Border radius:** 8px para tarjetas, 4px para inputs
- **Spacing:** Sistema de 4px (TailwindCSS default)
- **Animaciones:** Transiciones suaves (150ms ease)

### Accesibilidad
- Contraste mínimo AA (4.5:1 para texto, 3:1 para UI)
- Aria labels en todos los elementos interactivos
- Keyboard navigation completa
- Focus visible states
- Screen reader compatible

## Principios de Diseño
- **Real-time first:** Los datos se actualizan automáticamente cada 5s
- **Información accionable:** Cada dato mostrado debe sugerir una acción
- **Progressive disclosure:** Resumen → Detalle al hacer clic
- **Status-driven:** Colores indican estado inmediatamente (verde/amarillo/rojo)
- **Activity feed visible:** El timeline de Kiro siempre visible en sidebar

## Linting y Formato
- ESLint con plugin react-hooks y react-refresh
- Prettier para formato automático
- TypeScript strict mode
- No `any` types permitidos
