import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function EditProductDialog({ product, onSave, trigger }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setEditingProduct({ ...product });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingProduct && editingProduct.name.trim()) {
      onSave(editingProduct);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to the product</DialogDescription>
        </DialogHeader>
        {editingProduct && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-product-name">Product Name</Label>
              <Input
                id="edit-product-name"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-regular-price">Regular Price (₱)</Label>
                <Input
                  id="edit-regular-price"
                  type="number"
                  value={editingProduct.price.regular}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: {
                        ...editingProduct.price,
                        regular: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-large-price">Large Price (₱)</Label>
                <Input
                  id="edit-large-price"
                  type="number"
                  value={editingProduct.price.large}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: { ...editingProduct.price, large: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
