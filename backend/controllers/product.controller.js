import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

export const addProduct = asyncHandler(async (req, res) => {
  if (!req.user.role === "seller") {
    throw new Error("You are not authorized to create a product");
  }
  delete req.body.category;
  if (
    !req.body.name ||
    !req.body.price ||
    !req.body.quantity ||
    !req.body.description ||
    !req.body.categoryId ||
    !req.body.image
  ) {
    throw new Error("All fields including image are required");
  }
  const slug = req.body.name
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newProduct = new Product({
    ...req.body,
    slug,
    createdBy: req.user.id,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    throw new Error(error);
  }
});

export const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    if (!product) {
      throw new Error("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { searchTerm } = req.params;
  try {
    const products = await Product.find({ slug: searchTerm });
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      throw new Error("Product not found");
    }
    if (!req.user.role === "admin") {
      throw new Error("You are not authorized to update a product");
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      throw new Error("Product not found");
    }
    if (!req.user.role === "admin") {
      throw new Error("You are not authorized to delete a product");
    }
    await Product.findOneAndDelete({ slug: req.params.slug });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});
