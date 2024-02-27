import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const verifyUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.cookie_token;
  if (!token) {
    throw new Error("You need to login first");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw new Error("You need to login first");
    }
    req.user = user;
    next();
  });
});
