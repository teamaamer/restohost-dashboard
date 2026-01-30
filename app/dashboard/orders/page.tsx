"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Eye, Package, CreditCard, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [page])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders?page=${page}&limit=20`)
      const data = await res.json()
      setOrders(data.orders)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalItems = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Orders
        </h1>
        <p className="text-gray-600 mt-0.5 text-sm">
          View and manage all restaurant orders
        </p>
      </div>

      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <TableRow className="border-b-2 border-purple-200">
                  <TableHead className="text-gray-700 font-semibold">Created</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Restaurant</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Items</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Total</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Payment</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Customer</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Phone</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Call</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                      <TableCell className="text-gray-700">
                        {format(new Date(order.createdAt), "MMM dd, HH:mm")}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {order.restaurant.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.orderType === "DELIVERY" ? "default" : "secondary"}>
                          {order.orderType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {totalItems(order)}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        ${Number(order.total).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-700">{order.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">{order.customerName || "-"}</TableCell>
                      <TableCell className="text-sm text-gray-700">{order.customerPhone || "-"}</TableCell>
                      <TableCell>
                        {order.call?.isRecorded ? (
                          <Badge variant="success" className="text-gray-700">
                            <Phone className="h-3 w-3 mr-1" />
                            Recorded
                          </Badge>
                        ) : (
                          <Badge variant="outline">No call</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-700">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white border-purple-200"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white border-purple-200"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Restaurant</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedOrder.restaurant.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Order Type</p>
                  <Badge className="mt-1">{selectedOrder.orderType}</Badge>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Payment Method</p>
                  <Badge variant="outline" className="mt-1 text-gray-700">{selectedOrder.paymentMethod}</Badge>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Total</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                    ${Number(selectedOrder.total).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Customer</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedOrder.customerName || "N/A"}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Phone</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedOrder.customerPhone || "N/A"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200">
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
                        <p className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
    </div>
  )
}
