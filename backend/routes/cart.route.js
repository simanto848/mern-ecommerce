import express from "express";
import {
  addItemToCart,
  getCartItems,
  removeItemFromCart,
} from "../controllers/cart.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.put("/add", verifyUser, addItemToCart);
router.get("/get-items", verifyUser, getCartItems);
router.delete("/remove/:productId", verifyUser, removeItemFromCart);

export default router;
