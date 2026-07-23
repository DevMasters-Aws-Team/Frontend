import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Zap, LogOut } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'Chat con Kiro' },
  { to: '/chaos', icon: Zap, label: 'Chaos Engineering' },
]

export default function Sidebar() {
  const logout = useAppStore((s) => s.logout)

  return (
    <aside className="w-64 bg-[var(--color-bg-secondary)] border-r border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">
          <span className="text-blue-400">Kiro</span> Monitor
        </h1>
        <p className="text-xs text-slate-400 mt-1">SRE Autonomous Agent</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
