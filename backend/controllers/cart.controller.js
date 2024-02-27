import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import asyncHandler from "express-async-handler";

export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const cart = await Cart.findOne({ userId: req.user._id });
    const isProductExist = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (isProductExist) {
      await Cart.findOneAndUpdate(
        { userId: req.user._id, "products.productId": productId },
        {
          $set: {
            "products.$.quantity": isProductExist.quantity + quantity,
          },
        }
      );
    } else {
      cart.products.push({ productId, quantity });
    }
    const cartProduct = await cart.save();
    res
      .status(201)
      .json({ message: "Product added to cart successfully", cartProduct });
  } catch (error) {
    throw new Error(error);
  }
});

export const getCartItems = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );
    res.status(200).json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (product) {
      await Cart.findOneAndUpdate(
        { userId: req.user._id },
        {
          $pull: { products: { productId } },
        }
      );
      res.status(200).json({ message: "Product removed from cart" });
    } else {
      res.status(404);
      throw new Error("Product not found in cart");
    }
  } catch (error) {
    throw new Error(error);
  }
});
