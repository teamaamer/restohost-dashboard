"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Eye, Phone, Clock, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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

  useEffect(() => {
    fetchCalls()
  }, [page])

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

  const filteredTranscript = selectedCall?.transcriptText
    .split("\n")
    .filter((line) =>
      searchTerm ? line.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Calls
        </h1>
        <p className="text-gray-600 mt-0.5 text-sm">
          View call transcripts and recordings
        </p>
      </div>

      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800">All Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <TableRow className="border-b-2 border-purple-200">
                  <TableHead className="text-gray-700 font-semibold">Start Time</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Restaurant</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Caller</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Duration</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Outcome</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Recorded</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Orders</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading calls...
                    </TableCell>
                  </TableRow>
                ) : calls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No calls found
                    </TableCell>
                  </TableRow>
                ) : (
                  calls.map((call) => (
                    <TableRow key={call.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                      <TableCell className="text-gray-700">
                        {format(new Date(call.startedAt), "MMM dd, HH:mm")}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {call.restaurant.name}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-800">{call.callerName || "Unknown"}</p>
                          <p className="text-xs text-gray-600">{call.callerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {Math.floor(call.durationSeconds / 60)}:{String(call.durationSeconds % 60).padStart(2, '0')}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(call.durationSeconds)}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{getOutcomeBadge(call.outcome)}</TableCell>
                      <TableCell className="text-gray-700">
                        {call.isRecorded ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-700">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {call.orders.length > 0 ? call.orders.length : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCall(call)}
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

      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Call Details
            </DialogTitle>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-6">
              {selectedCall.recordingUrl && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
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
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Restaurant</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedCall.restaurant.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Caller</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedCall.callerName || "Unknown"}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{selectedCall.callerPhone}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Duration</p>
                  <p className="font-semibold text-gray-800 mt-1">{formatDuration(selectedCall.durationSeconds)}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Outcome</p>
                  {getOutcomeBadge(selectedCall.outcome)}
                </div>
              </div>

              {selectedCall.summaryText && (
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Call Summary</h3>
                  <p className="text-sm text-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl leading-relaxed">
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
                      <div key={idx} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200">
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
    </div>
  )
}
