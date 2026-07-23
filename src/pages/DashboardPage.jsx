import { useQuery } from '@tanstack/react-query'
import { fetchServices, fetchMetrics, fetchAlerts } from '../services/api'
import MetricsPanel from '../components/Dashboard/MetricsPanel'
import ServiceStatus from '../components/Dashboard/ServiceStatus'
import AlertsTable from '../components/Dashboard/AlertsTable'

export default function DashboardPage() {
  const { data: metrics } = useQuery({ queryKey: ['metrics'], queryFn: () => fetchMetrics().then(r => r.data) })
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: () => fetchServices().then(r => r.data) })
  const { data: alertsData } = useQuery({ queryKey: ['alerts'], queryFn: () => fetchAlerts().then(r => r.data) })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>

      {/* Métricas principales */}
      <MetricsPanel metrics={metrics} />

      {/* Grid: Servicios + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServiceStatus services={services || []} />
        <AlertsTable alerts={alertsData?.alerts || []} />
      </div>
    </div>
  )
}
