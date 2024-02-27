import express from "express";
import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, createCoupon);
router.get("/", verifyUser, getCoupons);
router.get("/:id", verifyUser, getCoupon);
router.put("/:id", verifyUser, updateCoupon);
router.delete("/:id", verifyUser, deleteCoupon);

export default router;
