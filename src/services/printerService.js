const PRINTER_SERVER_URL = "http://192.168.100.18:4000";

const printerService = {
  printReceipt: async (orderData) => {
    try {
      const response = await fetch(`${PRINTER_SERVER_URL}/print`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      return result.status === "success";
    } catch (error) {
      console.error("Error printing receipt:", error);
      return false;
    }
  },
};

export default printerService;
