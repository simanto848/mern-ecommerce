import express from "express";
import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/add", verifyUser, addProduct);
router.get("/", getProducts);
router.get("/:productId", getProduct);
router.put("/:productId", verifyUser, updateProduct);
router.delete("/remove/:productId", verifyUser, deleteProduct);
router.get("/search/:searchTerm", searchProducts);

export default router;
