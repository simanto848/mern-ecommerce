import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
