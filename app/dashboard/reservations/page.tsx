"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Eye, Calendar, Users, Clock, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/auth-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface Reservation {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  party_size: number
  reservation_datetime: string
  duration_minutes: number
  table_preference: string | null
  special_requests: string | null
  notes: string | null
  status: string
  created_at: string
}

export default function ReservationsPage() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    party_size: "2",
    status: "pending",
    table_preference: "",
    special_requests: "",
    notes: "",
  })

  useEffect(() => {
    fetchReservations()
  }, [page])

  const fetchReservations = async () => {
    if (!accessToken) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/reservations?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await res.json()
      setReservations(data.reservations || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch reservations:", error)
      setReservations([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      seated: "secondary",
      completed: "secondary",
      cancelled: "destructive",
      no_show: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status.replace("_", " ").toUpperCase()}</Badge>
  }

  const openEditDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setFormData({
      customer_name: reservation.customer_name,
      customer_phone: reservation.customer_phone,
      customer_email: reservation.customer_email || "",
      party_size: reservation.party_size.toString(),
      status: reservation.status,
      table_preference: reservation.table_preference || "",
      special_requests: reservation.special_requests || "",
      notes: reservation.notes || "",
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-3">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Reservations
            </h1>
            <p className="text-gray-600 mt-0.5 text-sm">
              View and manage restaurant reservations
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              Loading reservations...
            </CardContent>
          </Card>
        ) : reservations.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-gray-600">
              No reservations found
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="group border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-lg">
                          {reservation.customer_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {format(new Date(reservation.reservation_datetime), "MMM dd, yyyy • HH:mm")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 hover:bg-indigo-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedReservation(reservation)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditDialog(reservation)
                          }}
                          className="hover:bg-indigo-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-black" />
                          <span className="text-sm font-medium text-gray-700">
                            {reservation.party_size} guests
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {reservation.duration_minutes}min
                          </span>
                        </div>
                      </div>

                      {reservation.customer_phone && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            {reservation.customer_phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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

      {/* View Reservation Dialog */}
      <Dialog open={!!selectedReservation && !isEditOpen} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Reservation Details
            </DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Customer</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedReservation.customer_name}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedReservation.status)}</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Date & Time</p>
                  <p className="font-medium text-gray-800 mt-1">
                    {format(new Date(selectedReservation.reservation_datetime), "PPP 'at' p")}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Party Size</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{selectedReservation.party_size} guests</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Phone</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedReservation.customer_phone}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Email</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedReservation.customer_email || "N/A"}</p>
                </div>
              </div>

              {selectedReservation.table_preference && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Table Preference</p>
                  <p className="text-gray-800">{selectedReservation.table_preference}</p>
                </div>
              )}

              {selectedReservation.special_requests && (
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Special Requests</p>
                  <p className="text-gray-800">{selectedReservation.special_requests}</p>
                </div>
              )}

              {selectedReservation.notes && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Notes</p>
                  <p className="text-gray-800">{selectedReservation.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Update Reservation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Party Size</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.party_size}
                  onChange={(e) => setFormData({ ...formData, party_size: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="seated">Seated</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Special Requests</Label>
              <Input
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                placeholder="Any special requests"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Internal notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="text-gray-700 hover:text-gray-900">Cancel</Button>
            <Button className="bg-black hover:bg-gray-900 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
