import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

export const createReview = asyncHandler(async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;
    const product = await Product.findById(productId);
    if (product) {
      const review = new Review({
        userId: req.user._id,
        productId,
        comment,
        rating,
      });
      await review.save();
      res.status(201).json({ message: "Review added successfully" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const getReviews = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ productId }).populate("userId");
      res.status(200).json(reviews);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteReview = asyncHandler(async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (review) {
      if (review.userId.toString() === req.user._id.toString()) {
        await review.remove();
        res.status(200).json({ message: "Review deleted successfully" });
      } else {
        res.status(401);
        throw new Error("You are not authorized to delete this review");
      }
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});
