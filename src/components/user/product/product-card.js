import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";

export function ProductCard({ product, categoryId, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {product.price?.regular !== undefined && (
            <div className="flex justify-between text-sm">
              <span>Regular:</span>
              <span>₱{product.price.regular.toFixed(2)}</span>
            </div>
          )}
          {product.price?.large !== undefined && (
            <div className="flex justify-between text-sm">
              <span>Large:</span>
              <span>₱{product.price.large.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>{" "}
      <CardFooter className="flex justify-between">
        <EditProductDialog
          product={{ ...product, categoryId }}
          onSave={onEdit}
          trigger={
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
        />
        <DeleteProductDialog
          product={product}
          onDelete={() => onDelete(product, categoryId)}
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
