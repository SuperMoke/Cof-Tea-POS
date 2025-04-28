"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user/app_sidebar";
import { SiteHeader } from "@/components/user/site_header";
import { getUserData } from "@/lib/pocketbase";
import { Tabs } from "@/components/ui/tabs";
import {
  fetchCategories,
  fetchProductsByCategory,
} from "@/services/productService";
import { createOrder } from "@/services/orderService";

import { CategoryTabs } from "@/components/user/pos/category-tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast, Toaster } from "sonner";
import printerService from "@/services/printerService";

const DynamicProductGrid = dynamic(
  () =>
    import("@/components/user/pos/product-grid").then((mod) => mod.ProductGrid),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 mt-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading products...</p>
      </div>
    ),
    ssr: false,
  }
);

const DynamicCartSidebar = dynamic(
  () =>
    import("@/components/user/pos/cart-sidebar").then((mod) => mod.CartSidebar),
  {
    loading: () => (
      <div className="w-80 bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  }
);

import { Loader2 } from "lucide-react";

export default function PointofSalePage() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleCheckout = async ({ customerName, paymentAmount, change }) => {
    try {
      const orderData = {
        customerName,
        cartTotal,
        paymentAmount: parseFloat(paymentAmount),
        change,
        items: cart,
      };

      const result = await createOrder(orderData);

      // Attempt to print receipt
      await printReceipt(orderData);

      toast.success("Order placed successfully!");

      clearCart();
      setCustomerName("");
      setPaymentAmount("");
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  const printReceipt = async (orderData) => {
    try {
      const success = await printerService.printReceipt(orderData);
      if (success) {
        toast.success("Receipt printed successfully");
      } else {
        toast.error("Failed to print receipt");
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
      toast.error("Printing failed. Please check your printer connection.");
    }
  };

  useEffect(() => {
    const userData = getUserData();
    if (userData) setUser(userData);

    const getCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0 && !selectedCategory) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    getCategories();
  }, []);
  -useEffect(() => {
    const getProducts = async () => {
      if (!selectedCategory) return;

      if (products[selectedCategory]) {
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);
      try {
        const productsData = await fetchProductsByCategory(selectedCategory);
        setProducts((prevProducts) => ({
          ...prevProducts,
          [selectedCategory]: productsData,
        }));
      } catch (error) {
        console.error(
          `Failed to fetch products for category ${selectedCategory}:`,
          error
        );
        toast.error("Failed to load products");
        setProducts((prevProducts) => ({
          ...prevProducts,
          [selectedCategory]: [],
        }));
      } finally {
        setLoadingProducts(false);
      }
    };

    getProducts();
  }, [selectedCategory, products]);
  useEffect(() => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cart]);

  const updateCartItem = (itemId, updates) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const addToCart = (product, size) => {
    const price =
      size === "regular" ? product.regular_price : product.large_price;
    if (price == null) {
      console.warn(
        `Product ${product.name} - ${size} size has no valid price.`
      );
      return;
    }
    const cartItemId = `${product.id}-${size}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === cartItemId
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        const newItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          size: size,
          price: price,
          quantity: 1,
          instructions: "",
        };
        return [...prevCart, newItem];
      }
    });
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  if (loadingCategories) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <LoadingSpinner text="Loading categories..." />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] p-4 overflow-hidden">
          <div className="flex h-full gap-4">
            <div className="flex flex-col flex-1 overflow-hidden">
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              {selectedCategory && categories.length > 0 && (
                <Tabs
                  value={selectedCategory}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {(() => {
                    const currentCategory = categories.find(
                      (c) => c.id === selectedCategory
                    );
                    if (!currentCategory) return null;

                    return (
                      <DynamicProductGrid
                        category={currentCategory}
                        products={products[selectedCategory] || []}
                        isLoading={
                          loadingProducts && !products[selectedCategory]
                        }
                        onAddToCart={addToCart}
                      />
                    );
                  })()}
                </Tabs>
              )}
              {!selectedCategory && categories.length > 0 && (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a category to view products.
                </div>
              )}
            </div>
            {/* Cart sidebar (Dynamically Loaded) */}
            <DynamicCartSidebar
              cart={cart}
              cartTotal={cartTotal}
              onUpdateQuantity={updateCartItemQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
              customerName={customerName}
              paymentAmount={paymentAmount}
              onCustomerNameChange={setCustomerName}
              onPaymentAmountChange={setPaymentAmount}
              onUpdateCartItem={updateCartItem}
            />
          </div>
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
