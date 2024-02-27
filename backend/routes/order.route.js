import express from "express";
import {
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, addOrder);
router.get("/", verifyUser, getOrders);
router.get("/:id", verifyUser, getOrder);
router.put("/:id", verifyUser, updateOrder);
router.delete("/:id", verifyUser, deleteOrder);

export default router;
