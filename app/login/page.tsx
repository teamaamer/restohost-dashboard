"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/api-client"
import { useAuthStore } from "@/lib/auth-store"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log('[LOGIN] Starting login...')
      const { access_token, refresh_token } = await auth.login(email, password)
      console.log('[LOGIN] Got tokens')
      
      // Decode JWT to get user info
      const payload = JSON.parse(atob(access_token.split('.')[1]))
      console.log('[LOGIN] Decoded JWT payload:', payload)
      
      const user = {
        id: payload.sub,
        tenant_id: payload.tenant_id || null,
        email: email,
        full_name: email.split('@')[0],
        role: payload.role || 'staff_viewer',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      console.log('[LOGIN] Created user object:', user)
      
      // Store auth state
      console.log('[LOGIN] Calling login function...')
      login(access_token, refresh_token, user)
      
      // Check if state was set
      const authState = useAuthStore.getState()
      console.log('[LOGIN] Auth state after login:', {
        isAuthenticated: authState.isAuthenticated,
        hasUser: !!authState.user,
        hasToken: !!authState.accessToken
      })
      
      // Small delay to ensure persistence
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('[LOGIN] Redirecting to dashboard...')
      // Redirect
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error('[LOGIN] Error:', error)
      setError(error.response?.data?.detail || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white">
      {/* Grid pattern background */}
      <div className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"></div>
      {/* Radial gradient for faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <Card className="w-full max-w-md relative z-20 border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-black">
            Restaurant Analytics
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in with your Sammai account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-11 bg-black hover:bg-gray-900 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900 text-center font-medium">
              Use your Sammai account credentials<br/>
              <span className="text-blue-700">Contact your administrator if you need access</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
