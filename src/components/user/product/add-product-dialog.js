import { useState } from "react";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddProductDialog({ categories, onSave }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    regularPrice: "",
    largePrice: "",
    categoryId: "",
  });
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (
      newProduct.name.trim() &&
      newProduct.categoryId &&
      (newProduct.regularPrice || newProduct.largePrice)
    ) {
      onSave(newProduct);
      setNewProduct({
        name: "",
        regularPrice: newProduct.regularPrice,
        largePrice: newProduct.largePrice,
        categoryId: newProduct.categoryId,
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Create a new product item</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newProduct.categoryId}
              onValueChange={(value) =>
                setNewProduct({ ...newProduct, categoryId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="e.g., Classic Latte"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="regular-price">Regular Price (₱)</Label>
              <Input
                id="regular-price"
                type="number"
                value={newProduct.regularPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, regularPrice: e.target.value })
                }
                placeholder="120"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="large-price">Large Price (₱)</Label>
              <Input
                id="large-price"
                type="number"
                value={newProduct.largePrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, largePrice: e.target.value })
                }
                placeholder="150"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              At least one price is required
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
