// components/pos/product-card.js
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductCard({ product, onAddToCart }) {
  // Helper to format price or return 'N/A'
  const formatPrice = (price) => {
    return price?.toFixed(2) || "N/A";
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <div className="mt-2 space-y-2">
          {product.regular_price != null && (
            <div className="flex justify-between text-sm">
              <span>Regular:</span>
              <span>₱{formatPrice(product.regular_price)}</span>
            </div>
          )}
          {product.large_price != null && (
            <div className="flex justify-between text-sm">
              <span>Large:</span>
              <span>₱{formatPrice(product.large_price)}</span>
            </div>
          )}
        </div>
      </CardContent>{" "}
      <CardFooter className="flex justify-between p-4 pt-0">
        {product.regular_price != null && ( // Check for null/undefined explicitly
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddToCart(product, "regular")}
          >
            Add Regular
          </Button>
        )}
        {product.large_price != null && product.large_price !== 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddToCart(product, "large")}
          >
            Add Large
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
