"use client"

import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"

export default function AuthTestPage() {
  const { isAuthenticated, user, tenantId, accessToken, logout } = useAuthStore()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Auth State Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Current Auth State:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify({
            isAuthenticated,
            user,
            tenantId,
            hasToken: !!accessToken
          }, null, 2)}
        </pre>
      </div>

      <div className="space-x-4">
        <Button onClick={() => window.location.href = "/login"}>
          Go to Login
        </Button>
        <Button onClick={() => window.location.href = "/dashboard"}>
          Go to Dashboard
        </Button>
        <Button onClick={() => { logout(); window.location.href = "/login" }} variant="destructive">
          Logout
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Check localStorage: restaurant-analytics-auth</p>
      </div>
    </div>
  )
}
