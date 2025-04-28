"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
// Assuming you might want an icon, import it if needed
// import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Example

export function RecentTransactionsCard({ recentOrders }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Error formatting date";
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest completed orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0" // Add last:border-b-0
                >
                  <div className="flex items-center space-x-4">
                    {/* Placeholder Icon - Replace with actual icon if desired */}
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                      {/* <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" /> */}
                      <span className="text-green-500">✓</span>{" "}
                      {/* Simple text fallback */}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {order.customer_name}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {order.expand?.order_items
                          ?.slice(0, 2)
                          .map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {item.quantity}x {item.product_name}
                            </Badge>
                          ))}
                        {order.expand?.order_items?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{order.expand.order_items.length - 2} more items
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₱{order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.created)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent orders
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
