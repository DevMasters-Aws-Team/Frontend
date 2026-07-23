import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Endpoints
export const fetchHealth = () => api.get('/health')
export const fetchServices = () => api.get('/api/services')
export const fetchMetrics = (params) => api.get('/api/metrics', { params })
export const fetchAlerts = (params) => api.get('/api/alerts', { params })
export const fetchLogs = (params) => api.get('/api/logs', { params })
export const fetchTickets = (params) => api.get('/api/tickets', { params })
export const fetchKnowledge = (params) => api.get('/api/knowledge', { params })
export const postDiagnose = (data) => api.post('/api/diagnose', data)
export const postChaos = (type, data) => api.post(`/chaos/${type}`, data)
export const fetchChaosHistory = () => api.get('/chaos/history')

export default api
