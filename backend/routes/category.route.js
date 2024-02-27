import express from "express";
import { create, getAll, remove } from "../controllers/catrgory.controller.js";

const router = express.Router();

router.post("/create", create);
router.get("/getAll", getAll);
router.delete("/remove/:categoryId", remove);

export default router;
