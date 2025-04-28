"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user/app_sidebar";
import { SiteHeader } from "@/components/user/site_header";
import { getUserData } from "@/lib/pocketbase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryCard } from "@/components/user/product/category-card";
import { ProductCard } from "@/components/user/product/product-card";
import { AddCategoryDialog } from "@/components/user/product/add-category-dialog";
import { AddProductDialog } from "@/components/user/product/add-product-dialog";
import { CategoryFilter } from "@/components/user/product/category-filter";
import { LoadingState } from "@/components/ui/loading-state";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchProducts,
  createProduct,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "@/services/productService";

export default function ProductPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from PocketBase
  const loadData = async () => {
    setLoading(true);
    try {
      // Get user data
      const userData = getUserData();
      if (userData) {
        setUser(userData);
      }

      // Fetch categories
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);

      // Fetch products and organize by category
      const productsData = await fetchProducts();
      const productsByCategory = {};

      // Initialize empty arrays for each category
      categoriesData.forEach((category) => {
        productsByCategory[category.id] = [];
      });

      // Populate products by category
      productsData.forEach((product) => {
        if (product.category && productsByCategory[product.category]) {
          productsByCategory[product.category].push({
            id: product.id,
            name: product.name,
            price: {
              regular: product.regular_price,
              large: product.large_price,
            },
          });
        }
      });

      setProducts(productsByCategory);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Category CRUD operations
  const handleAddCategory = async (newCategory) => {
    try {
      const categoryData = {
        name: newCategory.name,
      };

      const savedCategory = await createCategory(categoryData);

      setCategories([...categories, savedCategory]);
      setProducts({ ...products, [savedCategory.id]: [] });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async (editingCategory) => {
    try {
      const updatedCategory = await updateCategory(editingCategory.id, {
        name: editingCategory.name,
      });

      const updatedCategories = categories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      );

      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);

      const updatedCategories = categories.filter(
        (cat) => cat.id !== categoryId
      );
      const updatedProducts = { ...products };
      delete updatedProducts[categoryId];

      setCategories(updatedCategories);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Product CRUD operations
  const handleAddProduct = async (newProduct) => {
    try {
      const productData = {
        name: newProduct.name,
        regular_price: parseFloat(newProduct.regularPrice),
        large_price: parseFloat(newProduct.largePrice),
        category: newProduct.categoryId,
      };

      const savedProduct = await createProduct(productData);

      const categoryProducts = products[newProduct.categoryId] || [];
      const formattedProduct = {
        id: savedProduct.id,
        name: savedProduct.name,
        price: {
          regular: savedProduct.regular_price,
          large: savedProduct.large_price,
        },
      };

      setProducts({
        ...products,
        [newProduct.categoryId]: [...categoryProducts, formattedProduct],
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (editingProduct) => {
    try {
      const productData = {
        name: editingProduct.name,
        regular_price: parseFloat(editingProduct.price.regular),
        large_price: parseFloat(editingProduct.price.large),
        category: editingProduct.categoryId,
      };

      const updatedProduct = await updateProductService(
        editingProduct.id,
        productData
      );

      const categoryId = editingProduct.categoryId;
      const formattedProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: {
          regular: updatedProduct.regular_price,
          large: updatedProduct.large_price,
        },
      };

      const updatedCategoryProducts = products[categoryId].map((prod) =>
        prod.id === formattedProduct.id ? formattedProduct : prod
      );

      setProducts({
        ...products,
        [categoryId]: updatedCategoryProducts,
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (product, categoryId) => {
    try {
      await deleteProductService(product.id);

      const updatedCategoryProducts = products[categoryId].filter(
        (p) => p.id !== product.id
      );

      setProducts({
        ...products,
        [categoryId]: updatedCategoryProducts,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <LoadingState />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6">Product Management</h1>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                  </TabsList>

                  {/* Categories Tab */}
                  <TabsContent value="categories">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Product Categories
                      </h2>
                      <AddCategoryDialog onSave={handleAddCategory} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                          No categories found. Create your first category to get
                          started.
                        </div>
                      ) : (
                        categories.map((category) => (
                          <CategoryCard
                            key={category.id}
                            category={category}
                            products={products[category.id] || []}
                            onEdit={handleUpdateCategory}
                            onDelete={handleDeleteCategory}
                          />
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Products Tab */}
                  <TabsContent value="products">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Products</h2>
                      <AddProductDialog
                        categories={categories}
                        onSave={handleAddProduct}
                      />
                    </div>

                    <CategoryFilter
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onChange={setSelectedCategory}
                    />

                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        {Object.keys(products).length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No products found. Create categories and add
                            products to get started.
                          </div>
                        ) : (
                          Object.entries(products)
                            .filter(
                              ([categoryId]) =>
                                !selectedCategory ||
                                categoryId === selectedCategory
                            )
                            .map(([categoryId, categoryProducts]) => {
                              const category = categories.find(
                                (c) => c.id === categoryId
                              );
                              if (!category) return null;

                              return (
                                <div key={categoryId} className="mb-8">
                                  <div className="flex items-center mb-4">
                                    <h3 className="text-lg font-semibold ml-2">
                                      {category.name}
                                    </h3>
                                  </div>

                                  {categoryProducts.length === 0 ? (
                                    <p className="text-muted-foreground">
                                      No products in this category
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {categoryProducts.map((product) => (
                                        <ProductCard
                                          key={product.id}
                                          product={product}
                                          categoryId={categoryId}
                                          onEdit={handleUpdateProduct}
                                          onDelete={handleDeleteProduct}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
