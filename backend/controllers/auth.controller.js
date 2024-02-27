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

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl, mobile } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("cookie_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        mobile,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
