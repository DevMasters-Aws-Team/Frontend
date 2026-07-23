import { Activity } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

const statusColors = {
  idle: 'bg-emerald-500',
  monitoring: 'bg-blue-500',
  diagnosing: 'bg-amber-500',
  resolving: 'bg-purple-500',
}

const statusLabels = {
  idle: 'Monitoreando',
  monitoring: 'Activo',
  diagnosing: 'Diagnosticando...',
  resolving: 'Resolviendo...',
}

export default function Header() {
  const kiroStatus = useAppStore((s) => s.kiroStatus)
  const user = useAppStore((s) => s.user)

  return (
    <header className="h-16 bg-[var(--color-bg-secondary)] border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Activity size={20} className="text-blue-400" />
        <span className="text-sm text-slate-300">Kiro Agent Status:</span>
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[kiroStatus]}`}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {statusLabels[kiroStatus]}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">{user?.email || 'dev@kiro.ai'}</span>
      </div>
    </header>
  )
}
