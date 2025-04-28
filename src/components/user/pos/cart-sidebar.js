// components/pos/cart-sidebar.js
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Printer } from "lucide-react";
import { CartItem } from "./cart-item";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import printerService from "@/services/printerService";
import { PrintingModal } from "./printing-modal";

import { toast } from "sonner";

export function CartSidebar({
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  customerName,
  paymentAmount,
  onCustomerNameChange,
  onPaymentAmountChange,
  onUpdateCartItem,
}) {
  const [change, setChange] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const paymentNum = parseFloat(paymentAmount) || 0;
    const calculatedChange = Math.max(0, paymentNum - cartTotal);
    setChange(calculatedChange);
  }, [paymentAmount, cartTotal]);

  const handleCheckout = async () => {
    const payment = parseFloat(paymentAmount) || 0;
    if (payment < cartTotal) {
      alert(
        "Payment amount must be greater than or equal to the total amount."
      );
      return;
    }

    const orderData = {
      customerName,
      cartTotal,
      paymentAmount: payment,
      change: change,
      items: cart,
    };

    onCheckout(orderData);
  };

  const handlePrintReceipt = async () => {
    if (cart.length === 0) {
      toast.error("Cannot print an empty cart");
      return;
    }

    setIsPrinting(true);
    try {
      const orderData = {
        customerName,
        cartTotal,
        paymentAmount: parseFloat(paymentAmount) || 0,
        change,
        items: cart,
      };

      const success = await printerService.printReceipt(orderData);

      if (success) {
        toast.success("Receipt printed successfully");
      } else {
        toast.error("Failed to print receipt");
      }
    } catch (error) {
      console.error("Printing error:", error);
      toast.error("Failed to print receipt");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="w-80 bg-muted rounded-lg p-4 flex flex-col h-[calc(100vh-4rem)]">
      {/* Printing Modal */}
      <PrintingModal
        isOpen={isPrinting}
        onOpenChange={(open) => {
          // Only allow closing if not currently printing
          if (!open && !isPrinting) setIsPrinting(false);
        }}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Cart
        </h2>
        {cart.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintReceipt}
            disabled={isPrinting || cart.length === 0}
          >
            <Printer className="mr-1 h-4 w-4" />
            {isPrinting ? "Printing..." : "Print"}
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Cart is empty
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-3 pb-1">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                    onUpdateItem={onUpdateCartItem}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="mt-4 space-y-4">
            <Separator />
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => onCustomerNameChange(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="total">Total</Label>
                  <div className="p-2 bg-background rounded font-medium">
                    ₱{cartTotal.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="payment">Payment</Label>
                  <Input
                    id="payment"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => onPaymentAmountChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between font-medium">
                <span>Change</span>
                <span>₱{change.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={isPrinting}
            >
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
