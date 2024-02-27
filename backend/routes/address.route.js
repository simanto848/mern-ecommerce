import express from "express";
import {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, addAddress);
router.get("/", verifyUser, getAddresses);
router.get("/:id", verifyUser, getAddress);
router.put("/:id", verifyUser, updateAddress);
router.delete("/:id", verifyUser, deleteAddress);

export default router;
