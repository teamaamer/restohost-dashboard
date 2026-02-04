"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { DollarSign, ShoppingCart, Phone, Clock, TrendingUp, CreditCard } from "lucide-react"
import { KpiCard } from "@/components/kpi-card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Metrics {
  sales: number
  orders: number
  avgTicket: number
  totalCalls: number
  callMinutes: number
  conversionRate: number
  dailySales: Array<{ date: string; sales: number; orders: number }>
  dailyCalls: Array<{ date: string; calls: number }>
  paymentMethods: Array<{ method: string; count: number; total: number }>
  topItems: Array<{ itemName: string; quantity: number; revenue: number }>
}

interface Restaurant {
  id: string
  name: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function OverviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [restaurantId, setRestaurantId] = useState<string>("all")
  const [orderType, setOrderType] = useState<string>("all")
  const [paymentMethod, setPaymentMethod] = useState<string>("all")
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [dateRange, restaurantId, orderType, paymentMethod])

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurants")
      const data = await res.json()
      setRestaurants(data)
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
    }
  }

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateRange?.from) params.append("from", dateRange.from.toISOString())
      if (dateRange?.to) params.append("to", dateRange.to.toISOString())
      if (restaurantId !== "all") params.append("restaurantId", restaurantId)
      if (orderType !== "all") params.append("orderType", orderType)
      if (paymentMethod !== "all") params.append("paymentMethod", paymentMethod)

      const res = await fetch(`/api/metrics?${params.toString()}`)
      const data = await res.json()
      setMetrics(data)
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !metrics) {
    return <div className="text-center py-12">Loading metrics...</div>
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          
          <Select value={restaurantId} onValueChange={setRestaurantId}>
            <SelectTrigger className="w-[200px] bg-white border-gray-200 hover:border-purple-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 font-medium text-gray-700">
              <SelectValue placeholder="All Restaurants" />
            </SelectTrigger>
            <SelectContent className="bg-white border-purple-200 shadow-xl">
              <SelectItem value="all" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">All Restaurants</SelectItem>
              {restaurants.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger className="w-[150px] bg-white border-gray-200 hover:border-purple-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 font-medium text-gray-700">
              <SelectValue placeholder="Order Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-purple-200 shadow-xl">
              <SelectItem value="all" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">All Types</SelectItem>
              <SelectItem value="PICKUP" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">Pickup</SelectItem>
              <SelectItem value="DELIVERY" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">Delivery</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-[150px] bg-white border-gray-200 hover:border-purple-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 font-medium text-gray-700">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent className="bg-white border-purple-200 shadow-xl">
              <SelectItem value="all" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">All Methods</SelectItem>
              <SelectItem value="CASH" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">Cash</SelectItem>
              <SelectItem value="CARD" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">Card</SelectItem>
              <SelectItem value="ONLINE" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">Online</SelectItem>
              <SelectItem value="OTHER" className="text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Left Column - 6 KPI Cards Stacked */}
        <div className="flex flex-col gap-2">
          <KpiCard
            title="Total Sales"
            value={`$${metrics.sales.toFixed(2)}`}
            icon={DollarSign}
            description="Revenue from placed orders"
          />
          <KpiCard
            title="Orders"
            value={metrics.orders}
            icon={ShoppingCart}
            description="Total orders placed"
          />
          <KpiCard
            title="Avg Ticket"
            value={`$${metrics.avgTicket.toFixed(2)}`}
            icon={TrendingUp}
            description="Average order value"
          />
          <KpiCard
            title="Total Calls"
            value={metrics.totalCalls}
            icon={Phone}
            description="Incoming calls received"
          />
          <KpiCard
            title="Call Minutes"
            value={metrics.callMinutes.toFixed(0)}
            icon={Clock}
            description="Total call duration"
          />
          <KpiCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            icon={CreditCard}
            description="Calls resulting in orders"
          />
        </div>

        {/* Right Column - 2x2 Grid of Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800">Sales & Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Tabs defaultValue="sales" className="h-full">
                <TabsList>
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="sales" className="mt-2">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={metrics.dailySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="orders" className="mt-2">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={metrics.dailySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800">Calls per Day</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={metrics.dailyCalls}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={metrics.paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.method}: ${entry.count}`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {metrics.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800">Top Items</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                {metrics.topItems.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 text-sm truncate">{item.itemName}</p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} sold
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2">
                      ${item.revenue.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
