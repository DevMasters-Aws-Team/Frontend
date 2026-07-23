import { AlertTriangle, Clock, CheckCircle, Ticket } from 'lucide-react'

const cards = [
  { key: 'error_rate', label: 'Error Rate', icon: AlertTriangle, suffix: '%', color: 'red' },
  { key: 'latency_p99_ms', label: 'Latencia P99', icon: Clock, suffix: 'ms', color: 'amber' },
  { key: 'availability_percent', label: 'Disponibilidad', icon: CheckCircle, suffix: '%', color: 'emerald' },
  { key: 'active_alerts', label: 'Alertas Activas', icon: Ticket, suffix: '', color: 'blue' },
]

export default function MetricsPanel({ metrics }) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.key} className="bg-[var(--color-bg-secondary)] rounded-xl border border-slate-700 p-5 animate-pulse h-28" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, suffix, color }) => (
        <div key={key} className="bg-[var(--color-bg-secondary)] rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{label}</span>
            <Icon size={18} className={`text-${color}-400`} />
          </div>
          <p className="text-2xl font-bold text-white">
            {metrics[key]}{suffix}
          </p>
        </div>
      ))}
    </div>
  )
}
