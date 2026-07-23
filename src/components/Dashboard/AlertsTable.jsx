import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AlertsTable({ alerts }) {
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-slate-700 p-5">
      <h3 className="text-lg font-medium text-white mb-4">Alertas Activas</h3>
      {alerts.length === 0 ? (
        <p className="text-slate-500 text-sm">Sin alertas activas</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {alerts.slice(0, 10).map((alert) => (
            <div key={alert.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  alert.severity === 'ERROR' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {alert.severity}
                </span>
                <div>
                  <p className="text-sm text-white">{alert.service}</p>
                  <p className="text-xs text-slate-400 truncate max-w-48">{alert.message}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true, locale: es })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
