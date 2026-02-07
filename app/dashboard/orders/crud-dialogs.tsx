import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderDialogsProps {
  isCreateOpen: boolean
  setIsCreateOpen: (open: boolean) => void
  isEditOpen: boolean
  setIsEditOpen: (open: boolean) => void
  isDeleteOpen: boolean
  setIsDeleteOpen: (open: boolean) => void
  formData: any
  setFormData: (data: any) => void
  restaurants: any[]
  selectedOrder: any
  handleCreate: () => void
  handleEdit: () => void
  handleDelete: () => void
}

export function OrderCRUDDialogs({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  formData,
  setFormData,
  restaurants,
  selectedOrder,
  handleCreate,
  handleEdit,
  handleDelete,
}: OrderDialogsProps) {
  return (
    <>
      {/* Create Order Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Add New Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant">Restaurant</Label>
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
                <Label htmlFor="orderType">Order Type</Label>
                <Select value={formData.orderType} onValueChange={(value) => setFormData({ ...formData, orderType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PICKUP">Pickup</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total Amount</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name (Optional)</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone (Optional)</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="text-gray-700 hover:text-gray-900">Cancel</Button>
            <Button onClick={handleCreate} className="bg-black hover:bg-gray-900 text-white">
              Create Order
            </Button>
          </DialogFooter>
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
                <Label htmlFor="edit-orderType">Order Type</Label>
                <Select value={formData.orderType} onValueChange={(value) => setFormData({ ...formData, orderType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PICKUP">Pickup</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paymentMethod">Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-total">Total Amount</Label>
              <Input
                id="edit-total"
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-customerName">Customer Name</Label>
                <Input
                  id="edit-customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customerPhone">Customer Phone</Label>
                <Input
                  id="edit-customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
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
            <DialogTitle className="text-2xl font-bold text-red-600">Delete Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="text-gray-700 hover:text-gray-900">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
