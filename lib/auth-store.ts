// Auth store using Zustand - matches dashboard-react-main pattern
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAuthToken } from './api-client'
import type { User } from './api-client'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  tenantId: string | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  setTenantId: (tenantId: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      tenantId: null,
      isAuthenticated: false,

      login: (accessToken, refreshToken, user) => {
        console.log('[AUTH STORE] Login called with:', { user, hasToken: !!accessToken })
        setAuthToken(accessToken)
        const newState = {
          accessToken,
          refreshToken,
          user,
          tenantId: user.tenant_id || null,
          isAuthenticated: true,
        }
        console.log('[AUTH STORE] Setting state:', newState)
        set(newState)
        console.log('[AUTH STORE] State set complete')
        
        // Force immediate persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('restaurant-analytics-auth', JSON.stringify({ state: newState }))
        }
      },

      logout: () => {
        setAuthToken(null)
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          tenantId: null,
          isAuthenticated: false,
        })
      },

      setTenantId: (tenantId) => {
        set({ tenantId })
      },
    }),
    {
      name: 'restaurant-analytics-auth',
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        console.log('[AUTH STORE] Rehydrating from storage:', state)
        // Restore auth token to axios instance after rehydration
        if (state?.accessToken) {
          console.log('[AUTH STORE] Restoring token to axios')
          setAuthToken(state.accessToken)
        }
      },
    }
  )
)
