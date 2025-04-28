import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";

export function CategoryCard({ category, products, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {products.length} products
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <EditCategoryDialog
          category={category}
          onSave={onEdit}
          trigger={
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
        />
        <DeleteCategoryDialog
          category={category}
          onDelete={onDelete}
          trigger={
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
