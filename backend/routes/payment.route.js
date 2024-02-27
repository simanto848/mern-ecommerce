import express from "express";
const router = express.Router();
import {
  processPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentCallback,
} from "../controllers/payment.controller.js";

router.post("/process/:orderId", processPayment);
router.get("/success", paymentSuccess);
router.get("/fail", paymentFail);
router.get("/cancel", paymentCancel);
router.post("/callback", paymentCallback);

export default router;
