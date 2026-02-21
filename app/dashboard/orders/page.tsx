"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Eye, Package, CreditCard, Phone, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/auth-store"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Order {
  id: string
  createdAt: string
  orderType: string
  total: number
  paymentMethod: string
  customerName: string | null
  customerPhone: string | null
  restaurant: { name: string }
  call: { isRecorded: boolean; recordingUrl: string | null } | null
  items: Array<{
    itemName: string
    quantity: number
    unitPrice: number | null
    modifiersJson: any
  }>
}

export default function OrdersPage() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({
    orderType: "PICKUP",
    paymentMethod: "CASH",
    total: "",
    customerName: "",
    customerPhone: "",
  })

  useEffect(() => {
    fetchOrders()
  }, [page])

  const fetchOrders = async () => {
    if (!accessToken) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/orders?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await res.json()
      setOrders(data.orders || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      setOrders([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const totalItems = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const handleEdit = async () => {
    if (!selectedOrder) return
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsEditOpen(false)
        setSelectedOrder(null)
        fetchOrders()
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  const openEditDialog = (order: Order) => {
    setSelectedOrder(order)
    setFormData({
      orderType: order.orderType,
      paymentMethod: order.paymentMethod,
      total: order.total.toString(),
      customerName: order.customerName || "",
      customerPhone: order.customerPhone || "",
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Orders
            </h1>
            <p className="text-gray-600 mt-0.5 text-sm">
              View and manage all restaurant orders
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              Loading orders...
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              No orders found
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="group border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-5">
                    {/* Header with Restaurant and Time */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-lg">
                          {order.restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {format(new Date(order.createdAt), "MMM dd, yyyy • HH:mm")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 hover:bg-indigo-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrder(order)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditDialog(order)
                          }}
                          className="hover:bg-indigo-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Order Type and Payment */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge 
                        variant={order.orderType === "DELIVERY" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {order.orderType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-800 font-medium">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {order.paymentMethod}
                      </Badge>
                      {order.call?.isRecorded && (
                        <Badge variant="success" className="text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Badge>
                      )}
                    </div>

                    {/* Items and Total */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-black" />
                          <span className="text-sm font-medium text-gray-700">
                            {totalItems(order)} items
                          </span>
                        </div>
                        <span className="text-xl font-bold text-black">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>

                      {/* Customer Info */}
                      {(order.customerName || order.customerPhone) && (
                        <div className="pt-3 border-t border-gray-100">
                          {order.customerName && (
                            <p className="text-sm text-gray-700 font-medium">
                              {order.customerName}
                            </p>
                          )}
                          {order.customerPhone && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {order.customerPhone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="bg-white hover:bg-black hover:text-white border-slate-200"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="bg-white hover:bg-black hover:text-white border-slate-200"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Restaurant</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedOrder.restaurant.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Order Type</p>
                  <Badge className="mt-1">{selectedOrder.orderType}</Badge>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Payment Method</p>
                  <Badge variant="outline" className="mt-1 text-gray-700">{selectedOrder.paymentMethod}</Badge>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Total</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                    ${Number(selectedOrder.total).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Customer</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedOrder.customerName || "N/A"}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Phone</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedOrder.customerPhone || "N/A"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-black">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.itemName}</p>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                        {item.modifiersJson && Object.keys(item.modifiersJson).length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            Modifiers: {JSON.stringify(item.modifiersJson)}
                          </p>
                        )}
                      </div>
                      {item.unitPrice && (
                        <p className="font-bold text-lg text-black">
                          ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.call && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Linked Call
                  </h3>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Recording Available</span>
                      <Badge variant={selectedOrder.call.isRecorded ? "success" : "outline"}>
                        {selectedOrder.call.isRecorded ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {selectedOrder.call.recordingUrl && (
                      <audio controls className="w-full mt-2">
                        <source src={selectedOrder.call.recordingUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Edit Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select value={formData.orderType} onValueChange={(value) => setFormData({ ...formData, orderType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PICKUP">Pickup</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                    <SelectItem value="DINE_IN">Dine In</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Phone</Label>
                <Input
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="text-gray-700 hover:text-gray-900">Cancel</Button>
            <Button onClick={handleEdit} className="bg-black hover:bg-gray-900 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
