// components/pos/cart-item.js
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, Edit, Check } from "lucide-react";

export function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateItem,
}) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState(item.price);
  const [instructions, setInstructions] = useState(item.instructions || "");

  const handlePriceEdit = () => {
    if (isEditingPrice) {
      // Save the new price
      const newPrice = parseFloat(editedPrice);
      if (!isNaN(newPrice) && newPrice > 0) {
        onUpdateItem(item.id, { price: newPrice });
      } else {
        // Reset if invalid
        setEditedPrice(item.price);
      }
    }
    setIsEditingPrice(!isEditingPrice);
  };

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
    onUpdateItem(item.id, { instructions: e.target.value });
  };

  return (
    <div className="bg-background rounded-md p-3">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{item.name}</h4>
          <div className="text-sm text-muted-foreground">
            {capitalize(item.size)}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center">
            {isEditingPrice ? (
              <Input
                type="number"
                min="0"
                step="any"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className="w-20 h-6 mr-1 text-sm"
              />
            ) : (
              <span>₱{item.price.toFixed(2)}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1"
              onClick={handlePriceEdit}
            >
              {isEditingPrice ? (
                <Check className="h-3 w-3" />
              ) : (
                <Edit className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">x{item.quantity}</div>
        </div>
      </div>

      {/* Custom instructions input */}
      <div className="mt-2">
        <Input
          placeholder="Special instructions..."
          value={instructions}
          onChange={handleInstructionsChange}
          className="text-xs"
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
