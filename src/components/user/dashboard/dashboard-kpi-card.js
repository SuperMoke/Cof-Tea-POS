"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardKpiCards({
  todaySales,
  pendingOrdersCount,
  productCount,
  categoryCount,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Today's Sales Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₱{todaySales.total.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {todaySales.count} orders today
          </p>
        </CardContent>
      </Card>

      {/* Pending Orders Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrdersCount}</div>
          <p className="text-xs text-muted-foreground">
            Orders waiting to be prepared
          </p>
        </CardContent>
      </Card>

      {/* Products Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productCount}</div>
          <p className="text-xs text-muted-foreground">Active menu items</p>
        </CardContent>
      </Card>

      {/* Categories Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryCount}</div>
          <p className="text-xs text-muted-foreground">Product categories</p>
        </CardContent>
      </Card>
    </div>
  );
}
