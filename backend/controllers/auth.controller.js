import User from "../models/user.model.js";
import bycrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  try {
    const { fullName, username, email, mobile, password } = req.body;
    const findUser = await User.findOne({
      $or: [{ username }, { email }, { mobile }],
    });
    if (findUser) {
      throw new Error("Username or email or mobile already exists");
    } else {
      const hashedPassword = await bycrypt.hash(password, 10);
      // Create a new user
      const newUser = await User.create({
        fullName,
        username,
        email,
        mobile,
        password: hashedPassword,
      });
      return res.json({ message: "User created successfully" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || username === "" || password === "") {
      throw new Error("Username or password is empty");
    }
    try {
      const validUser = await User.findOne({ username });
      if (!validUser) {
        throw new Error("User not found");
      }
      const validPassword = await bycrypt.compare(password, validUser.password);
      if (!validPassword) {
        throw new Error("Invalid password");
      }
      const token = jwt.sign(
        { id: validUser._id, role: validUser.role },
        process.env.JWT_SECRET
      );

      const { password: pass, ...user } = validUser._doc;
      res
        .cookie(
          "cookie_token",
          token,
          {
            httpOnly: true,
          },
          { maxAge: "9d" }
        )
        .json(user);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("cookie_token").json({ message: "User has been logged out" });
});
