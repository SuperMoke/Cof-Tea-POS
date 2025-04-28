"use client";

import { useEffect, useState, useRef } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user/app_sidebar";
import { SiteHeader } from "@/components/user/site_header";
import {
  getActiveOrders,
  subscribeToOrders,
  unsubscribeFromOrders,
} from "@/services/orderService";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { OrderCard } from "@/components/user/order/order-card";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getActiveOrders();
        setOrders(response.items);
        console.log("Fetched orders:", response.items);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Subscribe to real-time updates
    subscriptionRef.current = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
      console.log("Real-time order update received:", updatedOrders);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribeFromOrders(subscriptionRef.current);
    };
  }, []);

  const handleOrderComplete = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  const handleOrderRemove = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Orders</h1>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading orders..." />
          ) : orders.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onOrderComplete={handleOrderComplete}
                  onOrderRemove={handleOrderRemove}
                />
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
