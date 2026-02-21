"use client"

import { useEffect, useState } from "react"
import { DollarSign, ShoppingCart, Phone, Calendar, Users, TrendingUp } from "lucide-react"
import { KpiCard } from "@/components/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth-store"

interface CallStats {
  total_calls: number
  calls_last_24h: number
  calls_last_7d: number
  escalation_rate_7d: number
  avg_duration_seconds: number
  outcomes: Record<string, number>
}

interface OrderStats {
  orders_today: number
  revenue_today_dollars: number
  revenue_7d_dollars: number
  status_breakdown: Record<string, number>
}

interface ReservationStats {
  reservations_today: number
  covers_today: number
  upcoming: number
  no_show_rate_7d: number
  status_breakdown: Record<string, number>
}

export function OverviewContent() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [callStats, setCallStats] = useState<CallStats | null>(null)
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [reservationStats, setReservationStats] = useState<ReservationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (accessToken) {
      fetchAllStats()
    }
  }, [accessToken])

  const fetchAllStats = async () => {
    if (!accessToken) return

    setLoading(true)
    try {
      const headers = {
        'Authorization': `Bearer ${accessToken}`
      }

      const [callsRes, ordersRes, reservationsRes] = await Promise.all([
        fetch('/api/calls/stats', { headers }).catch(() => null),
        fetch('/api/orders/stats', { headers }).catch(() => null),
        fetch('/api/reservations/stats', { headers }).catch(() => null),
      ])

      if (callsRes?.ok) {
        const data = await callsRes.json()
        setCallStats(data)
      }

      if (ordersRes?.ok) {
        const data = await ordersRes.json()
        setOrderStats(data)
      }

      if (reservationsRes?.ok) {
        const data = await reservationsRes.json()
        setReservationStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Overview
          </h1>
          <p className="text-gray-600 mt-0.5 text-sm">
            Real-time analytics from Sammai AI
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Calls Stats */}
        <KpiCard
          title="Total Calls"
          value={callStats?.total_calls || 0}
          icon={Phone}
          description="All time calls received"
        />
        <KpiCard
          title="Calls (24h)"
          value={callStats?.calls_last_24h || 0}
          icon={Phone}
          description="Calls in last 24 hours"
        />
        <KpiCard
          title="Calls (7d)"
          value={callStats?.calls_last_7d || 0}
          icon={Phone}
          description="Calls in last 7 days"
        />

        {/* Order Stats */}
        <KpiCard
          title="Orders Today"
          value={orderStats?.orders_today || 0}
          icon={ShoppingCart}
          description="Orders placed today"
        />
        <KpiCard
          title="Revenue Today"
          value={`$${(orderStats?.revenue_today_dollars || 0).toFixed(2)}`}
          icon={DollarSign}
          description="Today's revenue"
        />
        <KpiCard
          title="Revenue (7d)"
          value={`$${(orderStats?.revenue_7d_dollars || 0).toFixed(2)}`}
          icon={TrendingUp}
          description="Last 7 days revenue"
        />

        {/* Reservation Stats */}
        <KpiCard
          title="Reservations Today"
          value={reservationStats?.reservations_today || 0}
          icon={Calendar}
          description="Reservations for today"
        />
        <KpiCard
          title="Covers Today"
          value={reservationStats?.covers_today || 0}
          icon={Users}
          description="Total guests today"
        />
        <KpiCard
          title="Upcoming"
          value={reservationStats?.upcoming || 0}
          icon={Calendar}
          description="Future reservations"
        />
      </div>

      {/* Status Breakdown Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {callStats?.outcomes && Object.keys(callStats.outcomes).length > 0 && (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800">Call Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(callStats.outcomes).map(([outcome, count]) => (
                  <div key={outcome} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{outcome.replace('_', ' ')}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {orderStats?.status_breakdown && Object.keys(orderStats.status_breakdown).length > 0 && (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(orderStats.status_breakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {reservationStats?.status_breakdown && Object.keys(reservationStats.status_breakdown).length > 0 && (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800">Reservation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(reservationStats.status_breakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
