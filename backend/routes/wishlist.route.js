import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/add", verifyUser, addToWishlist);
router.get("/", verifyUser, getWishlist);
router.delete("/remove/:productId", verifyUser, removeFromWishlist);

export default router;
