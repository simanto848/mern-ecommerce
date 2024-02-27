import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

export const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (product) {
      const wishlist = await Wishlist.findOne({ userId: req.user._id });
      if (wishlist) {
        const isProductExist = wishlist.products.find(
          (p) => p.productId.toString() === productId
        );
        if (isProductExist) {
          res.status(400);
          throw new Error("Product already in wishlist");
        }
        wishlist.products.push({ productId });
        await wishlist.save();
        res.status(201).json({ message: "Product added to wishlist" });
      } else {
        const newWishlist = new Wishlist({
          userId: req.user._id,
          products: [{ productId }],
        });
        await newWishlist.save();
        res.status(201).json({ message: "Product added to wishlist" });
      }
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const getWishlist = asyncHandler(async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );
    if (wishlist) {
      res.status(200).json(wishlist.products);
    } else {
      res.status(404);
      throw new Error("Wishlist not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => p.productId.toString() !== productId
      );
      await wishlist.save();
      res.status(200).json({ message: "Product removed from wishlist" });
    } else {
      res.status(404);
      throw new Error("Wishlist not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});
