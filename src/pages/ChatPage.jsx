import { useState } from 'react'
import { postDiagnose } from '../services/api'
import { Send, Bot, User } from 'lucide-react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy Kiro, tu agente SRE autónomo. Puedo ayudarte a diagnosticar errores en tus microservicios, ver el estado de las alertas, o ejecutar acciones de remediación. ¿En qué te puedo ayudar?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    try {
      // Simula una llamada al agente (en prod sería Bedrock via kiro-agent)
      const res = await postDiagnose({
        service: 'user-service',
        error_type: 'TimeoutError',
        message: userMsg,
      })
      const diagnosis = res.data.diagnosis

      const response = `**Diagnóstico para ${res.data.service}:**\n\n` +
        `• Causa raíz: ${diagnosis.root_cause}\n` +
        `• Solución: ${diagnosis.solution}\n` +
        `• Confianza: ${Math.round(diagnosis.confidence * 100)}%\n` +
        `• Error conocido: ${diagnosis.is_known ? 'Sí' : 'No'}\n` +
        `• Acción: ${diagnosis.action}`

      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error al comunicarse con el agente. Verifica que el backend esté corriendo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-white mb-4">Chat con Kiro</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-blue-400" />
              </div>
            )}
            <div className={`max-w-[70%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-[var(--color-bg-secondary)] text-slate-200 border border-slate-700 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                <User size={16} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot size={16} className="text-blue-400" />
            </div>
            <div className="bg-[var(--color-bg-secondary)] border border-slate-700 px-4 py-3 rounded-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3 bg-[var(--color-bg-secondary)] rounded-xl p-3 border border-slate-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pregunta a Kiro sobre tus microservicios..."
          className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-lg transition-colors"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  )
}
