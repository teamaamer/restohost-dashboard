import { useAuthStore } from './auth-store'

export function useAuthHeaders(): Record<string, string> {
  const accessToken = useAuthStore((state) => state.accessToken)
  
  if (!accessToken) {
    return {}
  }
  
  return {
    'Authorization': `Bearer ${accessToken}`
  }
}
