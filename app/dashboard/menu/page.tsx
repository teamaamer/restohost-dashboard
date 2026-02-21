"use client"

import { useEffect, useState } from "react"
import { Eye, UtensilsCrossed, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price_cents: number
  price_dollars: number
  category: string
  is_active: boolean
  is_available: boolean
  dietary_info: Record<string, boolean> | null
  prep_time_minutes: number | null
}

export default function MenuPage() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchMenuItems()
  }, [categoryFilter])

  const fetchMenuItems = async () => {
    if (!accessToken) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryFilter !== "all") {
        params.set("category", categoryFilter)
      }
      
      const res = await fetch(`/api/menu?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await res.json()
      setMenuItems(data.items || [])
      
      // Extract unique categories
      const uniqueCategories = [...new Set((data.items || []).map((item: MenuItem) => item.category))] as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Failed to fetch menu items:", error)
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  const getDietaryBadges = (dietaryInfo: Record<string, boolean> | null) => {
    if (!dietaryInfo) return null
    
    return Object.entries(dietaryInfo)
      .filter(([_, value]) => value)
      .map(([key]) => (
        <Badge key={key} variant="secondary" className="text-xs">
          {key.replace("_", " ")}
        </Badge>
      ))
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Menu
            </h1>
            <p className="text-gray-600 mt-0.5 text-sm">
              View restaurant menu items
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              Loading menu items...
            </CardContent>
          </Card>
        ) : menuItems.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              No menu items found
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="group border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {item.category}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 hover:bg-indigo-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedItem(item)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    {!item.is_active && (
                      <Badge variant="destructive" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                    {!item.is_available && (
                      <Badge variant="outline" className="text-xs">
                        Unavailable
                      </Badge>
                    )}
                    {getDietaryBadges(item.dietary_info)}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-xl font-bold text-green-600">
                        ${item.price_dollars.toFixed(2)}
                      </span>
                    </div>
                    {item.prep_time_minutes && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{item.prep_time_minutes}min</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Menu Item Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Menu Item Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 p-4 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Item Name</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedItem.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Category</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedItem.category}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Price</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                    ${selectedItem.price_dollars.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Status</p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant={selectedItem.is_active ? "default" : "destructive"}>
                      {selectedItem.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={selectedItem.is_available ? "default" : "outline"}>
                      {selectedItem.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
                {selectedItem.prep_time_minutes && (
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Prep Time</p>
                    <p className="font-medium text-gray-800 mt-1">{selectedItem.prep_time_minutes} minutes</p>
                  </div>
                )}
              </div>

              {selectedItem.description && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Description</p>
                  <p className="text-gray-800">{selectedItem.description}</p>
                </div>
              )}

              {selectedItem.dietary_info && Object.keys(selectedItem.dietary_info).length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Dietary Information</p>
                  <div className="flex flex-wrap gap-2">
                    {getDietaryBadges(selectedItem.dietary_info)}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
