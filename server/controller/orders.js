const orderModel = require("../models/orders");

class OrderController {
  // 🧾 Get all orders
  async getAllOrders(req, res) {
    try {
      const orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }

      return res.status(200).json({ orders });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return res.status(500).json({ error: "Server error while fetching orders" });
    }
  }

  // 👤 Get order by user
  async getOrderByUser(req, res) {
    const { uId } = req.body;

    if (!uId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const orders = await orderModel
        .find({ user: uId })
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }

      return res.status(200).json({ orders });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return res.status(500).json({ error: "Server error while fetching user orders" });
    }
  }

  async postCreateOrder(req, res) {
    const { allProduct, user, amount, transactionId, address, phone } = req.body;

    if (!allProduct || !user || !amount || !transactionId || !address || !phone) {
      return res.status(400).json({ message: "All fields must be provided" });
    }

    try {
      const newOrder = new orderModel({
        allProduct,
        user,
        amount,
        transactionId,
        address,
        phone,
      });

      await newOrder.save();
      return res.status(201).json({ success: "Order created successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Server error while creating order" });
    }
  }

  // ✏️ Update order status
  async postUpdateOrder(req, res) {
    const { oId, status } = req.body;

    if (!oId || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    try {
      await orderModel.findByIdAndUpdate(oId, {
        status,
        updatedAt: Date.now(),
      });

      return res.status(200).json({ success: "Order updated successfully" });
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ error: "Server error while updating order" });
    }
  }

  // 🗑️ Delete an order
  async postDeleteOrder(req, res) {
    const { oId } = req.body;

    if (!oId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    try {
      const deletedOrder = await orderModel.findByIdAndDelete(oId);

      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ success: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      return res.status(500).json({ error: "Server error while deleting order" });
    }
  }
}

module.exports = new OrderController();
