import { pb } from "@/lib/pocketbase";

// Category operations
export const fetchCategories = async () => {
  try {
    const records = await pb.collection("product_categories").getFullList({
      sort: "name",
    });
    return records;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const createCategory = async (categoryData) => {
  try {
    // Ensure user is authenticated

    // Include the user ID in the data
    const data = {
      name: categoryData.name,
    };

    const record = await pb.collection("product_categories").create(data);
    return record;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    // Ensure user is authenticated

    // Only update the name field, user ID should already be set
    const record = await pb
      .collection("product_categories")
      .update(id, { name: categoryData.name });
    return record;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    // Ensure user is authenticated

    await pb.collection("product_categories").delete(id);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Product operations
export const fetchProducts = async () => {
  try {
    // Ensure user is authenticated

    const records = await pb.collection("products").getFullList({
      expand: "category",
    });
    return records;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductsByCategory = async (categoryId) => {
  try {
    // Ensure user is authenticated

    const records = await pb.collection("products").getFullList({
      filter: `category = "${categoryId}" `,
    });
    return records;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
};

export const createProduct = async (productData) => {
  try {
    // Ensure user is authenticated

    // Include the user ID in the data
    const data = {
      ...productData,
    };

    const record = await pb.collection("products").create(data);
    return record;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Ensure user is authenticated

    const record = await pb.collection("products").update(id, productData);
    return record;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    // Ensure user is authenticated

    await pb.collection("products").delete(id);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
