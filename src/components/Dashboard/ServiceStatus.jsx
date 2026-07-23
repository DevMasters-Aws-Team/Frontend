import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

const statusConfig = {
  healthy: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  degraded: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  down: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  unknown: { icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-500/10' },
}

export default function ServiceStatus({ services }) {
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-slate-700 p-5">
      <h3 className="text-lg font-medium text-white mb-4">Microservicios</h3>
      <div className="space-y-3">
        {services.map((svc) => {
          const config = statusConfig[svc.status] || statusConfig.unknown
          const Icon = config.icon
          return (
            <div key={svc.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${config.bg}`}>
                  <Icon size={16} className={config.color} />
                </div>
                <span className="text-sm text-white">{svc.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Error: {svc.error_rate}%</span>
                <span>P99: {svc.latency_p99}ms</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
