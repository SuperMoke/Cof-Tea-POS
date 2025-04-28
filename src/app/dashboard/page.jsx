"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user/app_sidebar";
import { SiteHeader } from "@/components/user/site_header";
import { getUserData } from "@/lib/pocketbase";
import { fetchProducts, fetchCategories } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getActiveOrders,
  getOrders,
  getDashboardKPIs,
  getPopularProducts,
  getCategoryPerformance,
} from "@/services/orderService";

// Dynamically import the components
// Add simple loading placeholders or use Skeleton components
const DashboardKpiCards = dynamic(
  () =>
    import("@/components/user/dashboard/dashboard-kpi-card").then(
      (mod) => mod.DashboardKpiCards
    ),
  {
    loading: () => (
      <Skeleton className="h-[125px] w-full rounded-xl grid grid-cols-4 gap-4">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </Skeleton>
    ),
    ssr: false,
  }
);

const PendingOrdersCard = dynamic(
  () =>
    import("@/components/user/dashboard/pending-orders-card").then(
      (mod) => mod.PendingOrdersCard
    ),
  {
    loading: () => (
      <Skeleton className="h-[450px] w-full rounded-xl col-span-4" />
    ),
    ssr: false,
  }
);

const ProductPerformanceTabs = dynamic(
  () =>
    import("@/components/user/dashboard/product-performance-tabs").then(
      (mod) => mod.ProductPerformanceTabs
    ),
  {
    loading: () => (
      <Skeleton className="h-[450px] w-full rounded-xl col-span-3" />
    ),
    ssr: false,
  }
);

const RecentTransactionsCard = dynamic(
  () =>
    import("@/components/user/dashboard/recent-transactions-card").then(
      (mod) => mod.RecentTransactionsCard
    ),
  {
    loading: () => <Skeleton className="h-[400px] w-full rounded-xl" />,
    ssr: false,
  }
);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    todaySales: { total: 0, count: 0 },
    pendingOrdersCount: 0,
    productCount: 0,
    categoryCount: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch user data
        const userData = await getUserData();
        setUser(userData);

        // Fetch KPI data
        const kpis = await getDashboardKPIs();
        setKpiData(kpis);

        // Fetch active/pending orders
        const activeOrdersData = await getActiveOrders();
        setPendingOrders(activeOrdersData.items);

        // Fetch recent orders
        const recentOrdersData = await getOrders();
        setRecentOrders(recentOrdersData.items);

        // Fetch products and categories
        const productsData = await fetchProducts();
        setProducts(productsData);

        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        // Fetch actual popular products and category performance
        const popularProductsData = await getPopularProducts(5);
        setPopularProducts(popularProductsData);

        const categoryPerformanceData = await getCategoryPerformance(5);
        setCategoryPerformance(categoryPerformanceData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
              {/* Welcome Header */}
              <div className="flex flex-col gap-2 md:gap-4">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
                  Welcome, {isLoading ? "..." : user?.name || "Barista"}
                </h1>
                <p className="text-muted-foreground">
                  Here's what's happening at your coffee shop today
                </p>
              </div>

              <DashboardKpiCards
                todaySales={kpiData.todaySales}
                pendingOrdersCount={kpiData.pendingOrdersCount}
                productCount={kpiData.productCount}
                categoryCount={kpiData.categoryCount}
              />

              {/* Main Dashboard Content Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Pending Orders - Render dynamically */}
                <PendingOrdersCard pendingOrders={pendingOrders} />

                {/* Popular Products & Category Performance - Using actual data now */}
                <ProductPerformanceTabs
                  popularProducts={popularProducts}
                  categoryPerformance={categoryPerformance}
                />
              </div>

              <RecentTransactionsCard recentOrders={recentOrders} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
