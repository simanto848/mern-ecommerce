import express from "express";
import {
  createReview,
  getReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createReview);
router.get("/:productId", getReviews);
router.delete("/delete/:reviewId", verifyUser, deleteReview);

export default router;
