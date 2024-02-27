import Category from "../models/category.model.js";
import asyncHandler from "express-async-handler";

export const create = asyncHandler(async (req, res) => {
  try {
    const { name, icon } = req.body;
    const findCategory = await Category.findOne({ name });
    if (findCategory) {
      throw new Error("Category already exists");
    } else {
      const newCategory = await Category.create({ name, icon });
      return res.json({ message: "Category created successfully" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const getAll = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

export const remove = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const findCategory = await Category.findById(categoryId);
    if (!findCategory) {
      throw new Error("Category not found");
    } else {
      await Category.findByIdAndDelete(categoryId);
      return res.json({ message: "Category deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});
