"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Eye, Phone, Clock, Search, ShoppingCart, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface Call {
  id: string
  startedAt: string
  endedAt: string
  durationSeconds: number
  callerPhone: string
  callerName: string | null
  outcome: string
  isRecorded: boolean
  recordingUrl: string | null
  transcriptText: string
  summaryText: string | null
  restaurant: { name: string }
  orders: Array<{
    total: number
    paymentMethod: string
    items: Array<{ itemName: string; quantity: number }>
  }>
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [formData, setFormData] = useState<any>({
    restaurantId: "",
    callerPhone: "",
    callerName: "",
    durationSeconds: "0",
    outcome: "OTHER",
    transcriptText: "",
    summaryText: "",
    audioFile: null,
  })

  useEffect(() => {
    fetchCalls()
    fetchRestaurants()
  }, [page])

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurants")
      const data = await res.json()
      setRestaurants(data)
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
    }
  }

  const fetchCalls = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/calls?page=${page}&limit=20`)
      const data = await res.json()
      setCalls(data.calls)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Failed to fetch calls:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getOutcomeBadge = (outcome: string) => {
    const variants: Record<string, "success" | "warning" | "destructive" | "outline"> = {
      ORDER_PLACED: "success",
      INQUIRY: "warning",
      MISSED: "destructive",
      CANCELED: "destructive",
      OTHER: "outline",
    }
    return <Badge variant={variants[outcome] || "outline"}>{outcome.replace("_", " ")}</Badge>
  }

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          durationSeconds: parseInt(formData.durationSeconds) || 0,
        }),
      })
      if (res.ok) {
        setIsCreateOpen(false)
        setFormData({
          restaurantId: "",
          callerPhone: "",
          callerName: "",
          durationSeconds: "0",
          outcome: "OTHER",
          transcriptText: "",
          summaryText: "",
        })
        fetchCalls()
      }
    } catch (error) {
      console.error("Failed to create call:", error)
    }
  }

  const handleEdit = async () => {
    if (!selectedCall) return
    try {
      const res = await fetch(`/api/calls/${selectedCall.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsEditOpen(false)
        setSelectedCall(null)
        fetchCalls()
      }
    } catch (error) {
      console.error("Failed to update call:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedCall) return
    try {
      const res = await fetch(`/api/calls/${selectedCall.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setIsDeleteOpen(false)
        setSelectedCall(null)
        fetchCalls()
      }
    } catch (error) {
      console.error("Failed to delete call:", error)
    }
  }

  const openEditDialog = (call: Call) => {
    setSelectedCall(call)
    setFormData({
      restaurantId: "",
      callerPhone: call.callerPhone,
      callerName: call.callerName || "",
      durationSeconds: call.durationSeconds.toString(),
      outcome: call.outcome,
      transcriptText: call.transcriptText,
      summaryText: call.summaryText || "",
    })
    setIsEditOpen(true)
  }

  const openDeleteDialog = (call: Call) => {
    setSelectedCall(call)
    setIsDeleteOpen(true)
  }

  const filteredTranscript = selectedCall?.transcriptText
    .split("\n")
    .filter((line) =>
      searchTerm ? line.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Calls
            </h1>
            <p className="text-gray-600 mt-0.5 text-sm">
              View call transcripts and recordings
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-black hover:bg-gray-900 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Call
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              Loading calls...
            </CardContent>
          </Card>
        ) : calls.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              No calls found
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {calls.map((call) => (
                <Card
                  key={call.id}
                  className="group border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCall(call)}
                >
                  <CardContent className="p-5">
                    {/* Header with Restaurant and Time */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-lg">
                          {call.restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {format(new Date(call.startedAt), "MMM dd, yyyy • HH:mm")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 hover:bg-indigo-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCall(call)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditDialog(call)
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
                            openDeleteDialog(call)
                          }}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Caller Info */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="h-4 w-4 text-black" />
                        <span className="font-semibold text-gray-900">
                          {call.callerName || "Unknown Caller"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{call.callerPhone}</p>
                    </div>

                    {/* Badges Row */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {getOutcomeBadge(call.outcome)}
                      {call.isRecorded && (
                        <Badge variant="success" className="text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          Recorded
                        </Badge>
                      )}
                      {call.orders.length > 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {call.orders.length} {call.orders.length === 1 ? "Order" : "Orders"}
                        </Badge>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-gray-700">Duration</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">
                        {formatDuration(call.durationSeconds)}
                      </span>
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

      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Call Details
            </DialogTitle>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-6">
              {selectedCall.recordingUrl && (
                <div className="p-4 rounded-xl bg-gray-50">
                  <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-black">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    Audio Recording
                  </h3>
                  <audio controls className="w-full">
                    <source src={selectedCall.recordingUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Restaurant</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedCall.restaurant.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Caller</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedCall.callerName || "Unknown"}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{selectedCall.callerPhone}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Duration</p>
                  <p className="font-semibold text-gray-800 mt-1">{formatDuration(selectedCall.durationSeconds)}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Outcome</p>
                  {getOutcomeBadge(selectedCall.outcome)}
                </div>
              </div>

              {selectedCall.summaryText && (
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Call Summary</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">
                    {selectedCall.summaryText}
                  </p>
                </div>
              )}

              {selectedCall.orders.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    Linked Orders
                  </h3>
                  <div className="space-y-2">
                    {selectedCall.orders.map((order, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant="outline" className="text-gray-700">{order.paymentMethod}</Badge>
                          <p className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ${Number(order.total).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm text-gray-700">
                          {order.items.map((item, i) => (
                            <span key={i}>
                              {item.quantity}x {item.itemName}
                              {i < order.items.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Transcript</h3>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transcript..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  {filteredTranscript?.map((line, idx) => (
                    <div key={idx} className="py-1">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Call Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Add New Call
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Restaurant</Label>
                <Select value={formData.restaurantId} onValueChange={(value) => setFormData({ ...formData, restaurantId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurants.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Outcome</Label>
                <Select value={formData.outcome} onValueChange={(value) => setFormData({ ...formData, outcome: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORDER_PLACED">Order Placed</SelectItem>
                    <SelectItem value="INQUIRY">Inquiry</SelectItem>
                    <SelectItem value="MISSED">Missed</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Caller Phone</Label>
                <Input
                  value={formData.callerPhone}
                  onChange={(e) => setFormData({ ...formData, callerPhone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Caller Name (Optional)</Label>
                <Input
                  value={formData.callerName}
                  onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
                  placeholder="Enter caller name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duration (seconds)</Label>
              <Input
                type="number"
                value={formData.durationSeconds}
                onChange={(e) => setFormData({ ...formData, durationSeconds: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Audio Recording (Optional)</Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFormData({ ...formData, audioFile: file })
                  }
                }}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">Upload an audio file for this call recording</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="text-gray-700 hover:text-gray-900">Cancel</Button>
            <Button onClick={handleCreate} className="bg-black hover:bg-gray-900 text-white">
              Create Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Call Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Edit Call
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Caller Phone</Label>
                <Input
                  value={formData.callerPhone}
                  onChange={(e) => setFormData({ ...formData, callerPhone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Caller Name</Label>
                <Input
                  value={formData.callerName}
                  onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
                  placeholder="Enter caller name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Select value={formData.outcome} onValueChange={(value) => setFormData({ ...formData, outcome: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDER_PLACED">Order Placed</SelectItem>
                  <SelectItem value="INQUIRY">Inquiry</SelectItem>
                  <SelectItem value="MISSED">Missed</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Delete Call</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete this call? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="text-gray-700 hover:text-gray-900">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
