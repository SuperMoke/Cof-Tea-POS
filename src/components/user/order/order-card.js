import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { updateOrderStatus, deleteOrder } from "@/services/orderService";
import { Trash2 } from "lucide-react"; // Assuming you have Lucide icons

export function OrderCard({ order, onOrderComplete, onOrderRemove }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Error formatting date";
    }
  };

  const handleCompleteOrder = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, "Complete");
      if (onOrderComplete) {
        onOrderComplete(order.id);
      }
    } catch (error) {
      console.error("Failed to complete order:", error);
    } finally {
      setIsUpdating(false);
      setShowConfirmDialog(false);
    }
  };

  const handleRemoveOrder = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteOrder(order.id);
      if (onOrderRemove) {
        onOrderRemove(order.id);
      }
    } catch (error) {
      console.error("Failed to remove order:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order #{order.id}</CardTitle>
          <Badge>{order.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(order.created)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Customer</p>
              <p>{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total</p>
              <p>₱{order.total_amount.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.expand?.order_items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ₱{item.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      {order.status !== "Complete" && (
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => setShowConfirmDialog(true)}>
            Complete Order
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Remove Order
          </Button>

          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Order Completion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to mark Order #{order.id} as complete?
                  This action cannot be undone, and the order will no longer
                  appear in the orders list.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCompleteOrder} disabled={isUpdating}>
                  {isUpdating ? "Processing..." : "Complete Order"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Order Removal</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove Order #{order.id}? This action
                  will permanently delete this order and all its items. This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveOrder}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Order"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
}
