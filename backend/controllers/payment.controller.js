import asyncHandler from "express-async-handler";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import SSLCommerzPayment from "sslcommerz-lts";

// SSLCommerz Payment Gateway
const paymentGateway = new SSLCommerzPayment({
  store_id: process.env.SSLCOMMERZ_STORE_ID,
  store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
  is_live: false,
});

export const processPayment = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let totalAmount = 0;
    for (const item of order.orderItems) {
      totalAmount += item.price * item.qty;
    }

    const data = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: order._id.toString(),
      success_url: "YOUR_SUCCESS_URL",
      fail_url: "YOUR_FAIL_URL",
      cancel_url: "YOUR_CANCEL_URL",
      ipn_url: "YOUR_IPN_URL",
      shipping_method: "Courier",
      product_name: "Order Payment",
      product_category: "Digital",
      product_profile: "general",
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: req.user.address,
      cus_city: req.user.city,
      cus_country: req.user.country,
      cus_phone: req.user.phoneNo,
    };

    paymentGateway.init(data).then((apiResponse) => {
      const GatewayPageURL = apiResponse.GatewayPageURL;
      res.redirect(GatewayPageURL);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to process payment", error: error.message });
  }
});

const savePaymentAndRedirect = async (req, res, status) => {
  try {
    const payment = new Payment({
      orderId: req.body.tran_id,
      amount: req.body.amount,
      paymentMethod: req.body.card_type,
      status: status,
      transactionId: req.body.bank_tran_id,
    });

    await payment.save();

    res.redirect("YOUR_ORDER_HISTORY_URL");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to process payment", error: error.message });
  }
};

export const paymentSuccess = asyncHandler(async (req, res) => {
  await savePaymentAndRedirect(req, res, "Successful");
});

export const paymentFail = asyncHandler(async (req, res) => {
  await savePaymentAndRedirect(req, res, "Failed");
});

export const paymentCancel = asyncHandler(async (req, res) => {
  await savePaymentAndRedirect(req, res, "Cancelled");
});

export const paymentCallback = asyncHandler(async (req, res) => {
  await savePaymentAndRedirect(req, res, "Pending");
});
