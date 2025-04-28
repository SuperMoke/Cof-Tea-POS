"use strict";

const escpos = require("escpos");

escpos.USB = require("escpos-usb");

const device = new escpos.USB();

const options = { encoding: "Cp860" };

const printer = new escpos.Printer(device, options);

const express = require("express");

const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const port = 4000;

app.post("/print", (req, res) => {
  try {
    console.log("Printing receipt:", req.body);

    printReceipt(req.body);

    res.json({ status: "success" });
  } catch (error) {
    console.error("Print error:", error);

    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Printer server running at http://localhost:${port}`);
});

function printReceipt(orderData) {
  // Width constants for 58mm printer

  const PAPER_WIDTH = 32; // characters per line for 58mm printer // Helper function to truncate or pad text
  const INDENT = "  ";

  const formatLine = (left, right) => {
    left = left || "";
    right = right || "";
    const remainingSpace = PAPER_WIDTH - left.length - right.length;
    const spaces = remainingSpace > 0 ? " ".repeat(remainingSpace) : " ";
    return left + spaces + right;
  };

  const formatText = (text, length) => {
    if (!text) return " ".repeat(length);

    if (text.length > length) {
      return text.substring(0, length - 3) + "...";
    }

    return text.padEnd(length);
  }; // Helper for centering text

  const centerText = (text) => {
    text = text || "";
    const spaces = Math.max(0, Math.floor((PAPER_WIDTH - text.length) / 2));
    return " ".repeat(spaces) + text;
  };

  const PESO = "P";

  const wrapText = (text, maxWidth = PAPER_WIDTH, prefix = "") => {
    if (!text) return [];
    const words = text.split(" ");
    const lines = [];
    let currentLine = prefix;

    words.forEach((word) => {
      if ((currentLine + " " + word).length > maxWidth) {
        lines.push(currentLine.trim());
        currentLine = prefix + word;
      } else {
        currentLine += (currentLine === prefix ? "" : " ") + word;
      }
    });
    lines.push(currentLine.trim()); // Add the last line
    return lines;
  };

  device.open(function () {
    // Clear any previous formatting

    printer

      .align("ct") // Center alignment

      .style("b") // Bold style

      .size(1, 1) // Double size for store name ONLY

      .text("Cof/Tea")

      .size(0, 0) // Normal/small size for the rest
      .style("NORMAL")

      .text("Your Friendly Neighborhood Cafe")
      .text("Contact: 0993 659 0143") // Optional Contact
      .feed(1) // Add a line feed

      .text("Receipt")

      .text("-".repeat(PAPER_WIDTH))

      .feed(1)

      .align("lt") // Left alignment
      .text(formatLine("Date:", new Date().toLocaleDateString())) // Just date
      .text(formatLine("Time:", new Date().toLocaleTimeString())) // Just time
      // .text(formatLine("Receipt No:", orderData.orderId || 'N/A')) // Optional Order/Receipt Number
      .text(formatLine("Customer:", orderData.customerName || "Walk-in"))
      .text("-".repeat(PAPER_WIDTH)) // Separator line
      .feed(1);

    printer.style("b").text(formatLine("Item", "Total")).style("normal"); // Header for items section

    orderData.items.forEach((item) => {
      // Item Name (can wrap if too long)
      const itemNameLines = wrapText(
        `${item.name} (${item.size || "Regular"})`,
        PAPER_WIDTH
      );
      itemNameLines.forEach((line) => printer.text(line));

      // Quantity x Price aligned left, Item Subtotal aligned right

      const qtyPrice = `${item.quantity} x ${PESO}${(item.price || 0).toFixed(
        2
      )}`;
      const subtotal = `${PESO}${(
        (item.quantity || 1) * (item.price || 0)
      ).toFixed(2)}`;
      printer.text(formatLine(INDENT + qtyPrice, subtotal));

      // Print instructions if they exist, indented and wrapped
      if (item.instructions) {
        const noteLines = wrapText(
          item.instructions,
          PAPER_WIDTH - INDENT.length,
          INDENT + "> "
        ); // Prefix with indent and '>'
        noteLines.forEach((line) => printer.text(line));
      }
      printer.feed(1); // Space between items
    });

    printer
      .text("-".repeat(PAPER_WIDTH)) // Separator line
      .align("rt") // Right align the totals block
      .style("normal") // Normal style for labels
      .text(formatLine("Subtotal:", `${PESO}${orderData.cartTotal.toFixed(2)}`))
      // Add other charges like discounts or taxes if applicable
      // .text(formatLine("Discount:", `-₱${orderData.discount.toFixed(2)}`))
      // .text(formatLine("VAT (12%):", `₱${orderData.vat.toFixed(2)}`))
      .style("b") // Bold for the final total

      .style("normal") // Back to normal for payment details
      .feed(1) // Space before payment details
      .text(
        formatLine("Payment:", `${PESO}${orderData.paymentAmount.toFixed(2)}`)
      )
      .text(formatLine("Change:", `${PESO}${orderData.change.toFixed(2)}`))
      .feed(1) // Space before payment details
      .feed(1);

    printer
      .align("ct") // Center alignment
      .text("-".repeat(PAPER_WIDTH)) // Separator line
      .style("b")
      .text("Thank You!")
      .style("normal")
      // .text("WiFi: CofTeaGuest / Pass: yummycoffee") // Optional WiFi Info
      .feed(3) // Feed paper out before cutting
      .cut("full") // Cut the paper (use 'partial' if preferred and supported)
      .close(); // Close the connection IMPORTANT
  });
}
