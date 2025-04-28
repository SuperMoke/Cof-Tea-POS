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

export function EditCategoryDialog({ category, onSave, trigger }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setEditingCategory({ ...category });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingCategory && editingCategory.name.trim()) {
      onSave(editingCategory);
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
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to the product category
          </DialogDescription>
        </DialogHeader>
        {editingCategory && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
              />
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
