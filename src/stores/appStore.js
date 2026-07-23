import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Auth
  isAuthenticated: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),

  // UI
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Kiro Agent Status
  kiroStatus: 'idle', // idle | monitoring | diagnosing | resolving
  setKiroStatus: (status) => set({ kiroStatus: status }),
}))
