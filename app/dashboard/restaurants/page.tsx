"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Store, Phone, ShoppingCart, DollarSign, TrendingUp, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

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
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantStats | null>(null)
  const [formData, setFormData] = useState({ name: "", brand: "" })

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

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsCreateOpen(false)
        setFormData({ name: "", brand: "" })
        fetchRestaurants()
      }
    } catch (error) {
      console.error("Failed to create restaurant:", error)
    }
  }

  const handleEdit = async () => {
    if (!selectedRestaurant) return
    try {
      const res = await fetch(`/api/restaurants/${selectedRestaurant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsEditOpen(false)
        setSelectedRestaurant(null)
        setFormData({ name: "", brand: "" })
        fetchRestaurants()
      }
    } catch (error) {
      console.error("Failed to update restaurant:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedRestaurant) return
    try {
      const res = await fetch(`/api/restaurants/${selectedRestaurant.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setIsDeleteOpen(false)
        setSelectedRestaurant(null)
        fetchRestaurants()
      }
    } catch (error) {
      console.error("Failed to delete restaurant:", error)
    }
  }

  const openEditDialog = (restaurant: RestaurantStats) => {
    setSelectedRestaurant(restaurant)
    setFormData({ name: restaurant.name, brand: restaurant.brand || "" })
    setIsEditOpen(true)
  }

  const openDeleteDialog = (restaurant: RestaurantStats) => {
    setSelectedRestaurant(restaurant)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Restaurants
            </h1>
            <p className="text-gray-600 mt-0.5 text-sm">
              Performance metrics by restaurant
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </Button>
        </div>
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

      <div className="space-y-4">
        {loading ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              Loading restaurants...
            </CardContent>
          </Card>
        ) : restaurants.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              No restaurants found
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="group border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-5">
                  {/* Header with Restaurant Name */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                        <Store className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {restaurant.name}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditDialog(restaurant)
                        }}
                        className="hover:bg-indigo-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteDialog(restaurant)
                        }}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {restaurant.brand && (
                    <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-800 font-medium">
                      {restaurant.brand}
                    </Badge>
                  )}
                  {/* Stats Grid */}
                  <div className="space-y-3">
                    {/* Calls and Orders */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="h-4 w-4 text-purple-600" />
                          <span className="text-xs text-gray-600 font-medium">Calls</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{restaurant.totalCalls}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <ShoppingCart className="h-4 w-4 text-orange-600" />
                          <span className="text-xs text-gray-600 font-medium">Orders</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{restaurant.totalOrders}</p>
                      </div>
                    </div>

                    {/* Sales */}
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-gray-600 font-medium">Total Sales</span>
                      </div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${restaurant.sales.toFixed(2)}
                      </p>
                    </div>

                    {/* Avg Ticket and Conversion Rate */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium mb-1">Avg Ticket</p>
                        <p className="text-lg font-bold text-gray-900">${restaurant.avgTicket.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium mb-1">Conversion</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-indigo-600" />
                          <p className="text-lg font-bold text-indigo-600">{restaurant.conversionRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Last Call */}
                    {restaurant.lastCall && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Last call: {format(new Date(restaurant.lastCall), "MMM dd, yyyy • HH:mm")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Restaurant Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add New Restaurant
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter restaurant name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand (Optional)</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Enter brand name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="text-gray-700 hover:text-gray-900">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Create Restaurant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Restaurant Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Restaurant
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Restaurant Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter restaurant name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-brand">Brand (Optional)</Label>
              <Input
                id="edit-brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Enter brand name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="text-gray-700 hover:text-gray-900">
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">
              Delete Restaurant
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-bold">{selectedRestaurant?.name}</span>? 
              This action cannot be undone and will remove all associated data.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="text-gray-700 hover:text-gray-900">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Restaurant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
