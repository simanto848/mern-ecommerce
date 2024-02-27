import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import dbConfig from "./config/dbConfig.js";

import { errorHandler, notFound } from "./middlewares/errorHandler.js";
// Import the routes
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import couponRoutes from "./routes/coupon.route.js";
import addressRoutes from "./routes/address.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import reviewRoutes from "./routes/review.route.js";
import paymentRoutes from "./routes/payment.route.js";

// Call the config function from the dotenv package
config();

// Call the dbConfig function from the dbConfig.js file
dbConfig();

const app = express();

// Define the PORT
const PORT = process.env.PORT || 5000;

// Define the middleware
app.use(express.json());
app.use(cookieParser());

// Define the routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/payment", paymentRoutes);

// Not Found
app.use(notFound);
app.use(errorHandler);

// Create a express server
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON: http://localhost:${PORT}`);
});
