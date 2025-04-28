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

export function PendingOrdersCard({ pendingOrders }) {
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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Pending Orders</CardTitle>
        <CardDescription>
          Orders waiting to be prepared and served
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          {pendingOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending orders
            </p>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between space-x-4 rounded-md border p-4"
                >
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₱{order.total_amount.toFixed(2)} •{" "}
                      {formatDate(order.created)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {order.expand?.order_items
                        ?.slice(0, 3)
                        .map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item.quantity}x {item.product_name} {item.size}
                          </Badge>
                        ))}
                      {order.expand?.order_items?.length > 3 && (
                        <Badge variant="outline">
                          +{order.expand.order_items.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge className="whitespace-nowrap">{order.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
