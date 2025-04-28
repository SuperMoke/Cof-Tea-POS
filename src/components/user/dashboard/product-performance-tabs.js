"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ProductPerformanceTabs({
  popularProducts,
  categoryPerformance,
}) {
  return (
    <Card className="col-span-3">
      <Tabs defaultValue="popular">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="popular">Popular Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <div className="mt-2">
            <TabsContent value="popular">
              <CardTitle>Popular Items</CardTitle>
              <CardDescription>
                Your best-selling products by quantity
              </CardDescription>
            </TabsContent>

            <TabsContent value="categories">
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>
                How your menu categories contribute to sales
              </CardDescription>
            </TabsContent>
          </div>
        </CardHeader>

        <CardContent>
          <TabsContent value="popular">
            <ScrollArea className="h-[324px]">
              {popularProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No product data available
                </p>
              ) : (
                <div className="space-y-4">
                  {popularProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10">
                          {product.name?.substring(0, 2) || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₱{product.price?.toFixed(2) || "0.00"} ·{" "}
                          {product.totalQuantity} sold
                        </p>
                      </div>
                      {index === 0 && (
                        <Badge variant="default">Top Seller</Badge>
                      )}
                      {index > 0 && index < 3 && <Badge>Popular</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="categories">
            <ScrollArea className="h-[324px]">
              {categoryPerformance.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No category data available
                </p>
              ) : (
                <div className="space-y-6">
                  {categoryPerformance.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({category.productCount} products)
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {category.performance}% of sales
                        </span>
                      </div>
                      <Progress value={category.performance} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Revenue: ₱{category.totalRevenue?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
