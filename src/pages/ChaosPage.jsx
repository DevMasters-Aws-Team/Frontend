import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postChaos, fetchChaosHistory } from '../services/api'
import { Zap, AlertTriangle, Clock, Server } from 'lucide-react'

const chaosActions = [
  { type: 'timeout', label: 'Database Timeout', icon: Clock, color: 'amber', description: 'Simula un timeout de conexión a BD' },
  { type: 'error500', label: 'Error 500', icon: AlertTriangle, color: 'red', description: 'Fuerza un Internal Server Error' },
  { type: 'error503', label: 'Service Unavailable', icon: Server, color: 'purple', description: 'Simula servicio no disponible' },
  { type: 'cascade', label: 'Cascade Failure', icon: Zap, color: 'orange', description: 'Fallo en cascada multi-servicio' },
]

const services = ['user-service', 'order-service', 'payment-service', 'auth-service']

export default function ChaosPage() {
  const [selectedService, setSelectedService] = useState('user-service')
  const queryClient = useQueryClient()

  const { data: history } = useQuery({
    queryKey: ['chaos-history'],
    queryFn: () => fetchChaosHistory().then(r => r.data),
  })

  const mutation = useMutation({
    mutationFn: ({ type }) => postChaos(type, { service: selectedService, duration_ms: 30000 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chaos-history'] }),
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Chaos Engineering</h2>
      <p className="text-slate-400">Inyecta fallos en los microservicios para probar la detección y auto-remediación del agente Kiro.</p>

      {/* Selector de servicio */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-300">Servicio objetivo:</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Botones de Chaos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {chaosActions.map(({ type, label, icon: Icon, color, description }) => (
          <button
            key={type}
            onClick={() => mutation.mutate({ type })}
            disabled={mutation.isPending}
            className={`p-5 rounded-xl border border-slate-700 bg-[var(--color-bg-secondary)] hover:border-${color}-500/50 hover:bg-${color}-500/10 transition-all text-left group`}
          >
            <Icon size={24} className={`text-${color}-400 mb-3`} />
            <h3 className="text-white font-medium">{label}</h3>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          </button>
        ))}
      </div>

      {/* Historial */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-medium text-white mb-4">Historial de Inyecciones</h3>
        {history?.events?.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.events.slice().reverse().map((evt, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg text-sm">
                <span className="text-red-400 font-mono">{evt.type}</span>
                <span className="text-slate-300">{evt.service}</span>
                <span className="text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No se han inyectado fallos aún.</p>
        )}
      </div>
    </div>
  )
}
