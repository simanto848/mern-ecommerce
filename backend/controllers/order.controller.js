import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingInfo,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    const order = new Order({
      userId: req.user._id,
      orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      await Cart.findByIdAndDelete(cart._id);
    }

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error("Product not found");
      }

      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "orderItems.product",
      "name image"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export const getOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    throw new Error("Server Error");
  }
});

export const updateOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "Processing") {
      order.orderStatus = "Shipped";
      order.deliveredAt = Date.now();
    } else {
      order.orderStatus = "Processing";
      order.deliveredAt = null;
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    throw new Error("Server Error");
  }
});

export const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order removed" });
  } catch (error) {
    throw new Error("Server Error");
  }
});
