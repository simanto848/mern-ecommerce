import Coupon from "../models/coupon.model.js";
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercentage, expiry } = req.body;

  try {
    const coupon = new Coupon({
      code,
      discountPercentage,
      expiry,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const getCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

export const getCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params.id;

  try {
    const coupon = await Coupon.findOne({ _id: couponId });
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    res.status(200).json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    coupon.code = req.body.code || coupon.code;
    coupon.discountPercentage =
      req.body.discountPercentage || coupon.discountPercentage;
    coupon.expiry = req.body.expiry || coupon.expiry;

    const updatedCoupon = await coupon.save();
    res.status(200).json(updatedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    await coupon.remove();
    res.status(200).json({ message: "Coupon removed" });
  } catch (error) {
    throw new Error(error);
  }
});
