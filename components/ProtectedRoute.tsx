"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useEffect, useState } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    // Only check once on mount after allowing time for hydration
    const timer = setTimeout(() => {
      const authState = useAuthStore.getState()
      console.log('[PROTECTED ROUTE] One-time auth check:', { 
        isAuthenticated: authState.isAuthenticated,
        hasUser: !!authState.user,
        hasToken: !!authState.accessToken
      })
      
      if (!authState.isAuthenticated) {
        console.log('[PROTECTED ROUTE] Not authenticated, redirecting to login')
        window.location.href = "/login"
      } else {
        console.log('[PROTECTED ROUTE] Authenticated, allowing access')
        setIsChecking(false)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, []) // Empty dependency array - only run once on mount

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
