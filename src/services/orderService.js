import { pb } from "@/lib/pocketbase";

export const createOrder = async (orderData) => {
  try {
    // Create the order record
    const order = await pb.collection("orders").create({
      customer_name: orderData.customerName || "Guest",
      total_amount: orderData.cartTotal,
      payment_amount: orderData.paymentAmount,
      change_amount: orderData.change,
      status: "Pending",
      created_at: new Date().toISOString(),
    });

    // Create order items for each product in the cart
    const orderItems = await Promise.all(
      orderData.items.map((item) =>
        pb.collection("order_items").create({
          order_id: order.id,
          product_id: item.productId, // This references your existing products collection
          product_name: item.name,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })
      )
    );

    return { order, orderItems };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
export const getActiveOrders = async () => {
  try {
    const orders = await pb.collection("orders").getList(1, 50, {
      filter: 'status = "Pending"',
    });

    const ordersWithItems = await Promise.all(
      orders.items.map(async (order) => {
        const orderItems = await pb.collection("order_items").getList(1, 100, {
          filter: `order_id = "${order.id}"`,
        });
        return {
          ...order,
          expand: {
            ...order.expand,
            order_items: orderItems.items,
          },
        };
      })
    );

    // Return the result with the same structure as before but with enhanced items
    return {
      ...orders,
      items: ordersWithItems,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const getOrders = async () => {
  try {
    const orders = await pb.collection("orders").getList(1, 50, {
      sort: "-created",
    });

    const ordersWithItems = await Promise.all(
      orders.items.map(async (order) => {
        const orderItems = await pb.collection("order_items").getList(1, 100, {
          filter: `order_id = "${order.id}"`,
        });
        return {
          ...order,
          expand: {
            ...order.expand,
            order_items: orderItems.items,
          },
        };
      })
    );

    // Return the result with the same structure as before but with enhanced items
    return {
      ...orders,
      items: ordersWithItems,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const order = await pb.collection("orders").getOne(orderId);
    const orderItems = await pb.collection("order_items").getList(1, 100, {
      filter: `order_id = "${orderId}"`,
      expand: "product_id",
    });

    return { order, items: orderItems.items };
  } catch (error) {
    console.error(`Error fetching order details for ${orderId}:`, error);
    throw error;
  }
};

// Add this function to your existing orderService.js file
export async function updateOrderStatus(orderId, status) {
  try {
    const response = await pb.collection("orders").update(orderId, {
      status: status,
    });

    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function deleteOrder(orderId) {
  try {
    // First delete related order items to avoid foreign key constraints
    const orderItems = await pb.collection("order_items").getList(1, 100, {
      filter: `order_id = "${orderId}"`,
    });

    await Promise.all(
      orderItems.items.map((item) =>
        pb.collection("order_items").delete(item.id)
      )
    );

    // Then delete the order
    await pb.collection("orders").delete(orderId);

    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

export const getDashboardKPIs = async () => {
  try {
    // Get all orders
    const allOrders = await pb.collection("orders").getFullList({
      sort: "-created",
    });

    console.log(allOrders);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const todayOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.created);
      return orderDate >= today;
    });

    console.log(todayOrders);

    const pendingOrdersData = allOrders.filter(
      (order) => order.status === "Pending"
    );

    // Fetch product and category counts
    const productsCount = await pb.collection("products").getFullList();
    const categoriesCount = await pb
      .collection("product_categories")
      .getFullList();

    const totalSalesAmount = todayOrders.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    );

    return {
      todaySales: {
        total: totalSalesAmount,
        count: todayOrders.length,
      },
      pendingOrdersCount: pendingOrdersData.length,
      productCount: productsCount.length,
      categoryCount: categoriesCount.length,
    };
  } catch (error) {
    console.error("Error fetching dashboard KPIs:", error);

    return {
      todaySales: { total: 0, count: 0 },
      pendingOrdersCount: 0,
      productCount: 0,
      categoryCount: 0,
    };
  }
};

export const getPopularProducts = async (limit = 5) => {
  try {
    const orderItems = await pb.collection("order_items").getFullList({
      expand: "product_id",
    });

    const productSales = {};

    orderItems.forEach((item) => {
      const productId = item.product_id;
      if (!productSales[productId]) {
        productSales[productId] = {
          id: productId,
          name: item.product_name,
          price: item.price,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }

      productSales[productId].totalQuantity += item.quantity;
      productSales[productId].totalRevenue += item.subtotal;
    });

    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);

    return sortedProducts;
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};

export const getCategoryPerformance = async (limit = 5) => {
  try {
    const products = await pb.collection("products").getFullList();

    const productToCategory = {};
    products.forEach((product) => {
      productToCategory[product.id] = product.category;
    });

    const categories = await pb.collection("product_categories").getFullList();
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.id] = {
        id: category.id,
        name: category.name,
        productCount: 0,
        totalRevenue: 0,
      };
    });

    products.forEach((product) => {
      const categoryId = product.category;
      if (categoryMap[categoryId]) {
        categoryMap[categoryId].productCount += 1;
      }
    });

    const orderItems = await pb.collection("order_items").getFullList();

    let totalSales = 0;

    orderItems.forEach((item) => {
      const productId = item.product_id;
      const categoryId = productToCategory[productId];

      if (categoryId && categoryMap[categoryId]) {
        const subtotal = item.subtotal || item.price * item.quantity;
        categoryMap[categoryId].totalRevenue += subtotal;
        totalSales += subtotal;
      }
    });

    const categoryPerformance = Object.values(categoryMap)
      .map((category) => ({
        ...category,
        performance:
          totalSales > 0
            ? Math.round((category.totalRevenue / totalSales) * 100)
            : 0,
      }))
      .sort((a, b) => b.performance - a.performance)
      .slice(0, limit);

    return categoryPerformance;
  } catch (error) {
    console.error("Error calculating category performance:", error);
    return [];
  }
};

export const subscribeToOrders = (callback) => {
  return pb.collection("orders").subscribe("*", async (data) => {
    if (data.action === "create" || data.action === "update") {
      const orders = await getActiveOrders();
      callback(orders.items);
    } else if (data.action === "delete") {
      const orders = await getActiveOrders();
      callback(orders.items);
    }
  });
};

export const unsubscribeFromOrders = (subscriptionId) => {
  if (subscriptionId) {
    pb.collection("orders").unsubscribe(subscriptionId);
  }
};
