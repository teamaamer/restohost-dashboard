"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Store, Phone, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface RestaurantStats {
  id: string
  name: string
  brand: string | null
  totalCalls: number
  totalOrders: number
  sales: number
  avgTicket: number
  conversionRate: number
  lastCall: string | null
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/restaurants/stats")
      const data = await res.json()
      setRestaurants(data)
    } catch (error) {
      console.error("Failed to fetch restaurant stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Restaurants
        </h1>
        <p className="text-gray-600 mt-0.5 text-sm">
          Performance metrics by restaurant
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Restaurants</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Store className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">{restaurants.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Calls</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <Phone className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {restaurants.reduce((sum, r) => sum + r.totalCalls, 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Orders</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {restaurants.reduce((sum, r) => sum + r.totalOrders, 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Sales</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              ${restaurants.reduce((sum, r) => sum + r.sales, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800">Restaurant Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <TableRow className="border-b-2 border-purple-200">
                  <TableHead className="text-gray-700 font-semibold">Restaurant</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Brand</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Total Calls</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Total Orders</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Sales</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Avg Ticket</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Conversion Rate</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Last Call</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading restaurants...
                    </TableCell>
                  </TableRow>
                ) : restaurants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No restaurants found
                    </TableCell>
                  </TableRow>
                ) : (
                  restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id} className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                      <TableCell className="font-medium text-gray-800">{restaurant.name}</TableCell>
                      <TableCell>
                        {restaurant.brand ? (
                          <Badge variant="outline" className="text-gray-700">{restaurant.brand}</Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {restaurant.totalCalls}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="h-4 w-4 text-gray-500" />
                          {restaurant.totalOrders}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        ${restaurant.sales.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        ${restaurant.avgTicket.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={restaurant.conversionRate >= 50 ? "default" : "secondary"} className="text-gray-700">
                          {restaurant.conversionRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {restaurant.lastCall
                          ? format(new Date(restaurant.lastCall), "MMM dd, HH:mm")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
