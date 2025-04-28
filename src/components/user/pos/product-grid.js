// components/pos/product-grid.js
"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ProductCard } from "./product-card"; // Import the ProductCard

export function ProductGrid({
  category,
  products, // Expects the array of products for this category
  isLoading,
  onAddToCart,
}) {
  return (
    <TabsContent
      key={category.id}
      value={category.id}
      className="mt-0 flex-1 overflow-auto"
    >
      <h2 className="text-2xl font-bold mb-4">{category.name}</h2>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart} // Pass the handler down
              />
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              No products found in this category.
            </div>
          )}
        </div>
      )}
    </TabsContent>
  );
}
