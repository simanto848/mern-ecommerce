import asyncHandler from "express-async-handler";
import Address from "../models/address.model.js";

export const addAddress = asyncHandler(async (req, res) => {
  const {
    addressLine,
    city,
    state,
    postalCode,
    country,
    isDefault = false,
  } = req.body;

  try {
    const address = new Address({
      userId: req.user._id,
      addressLine,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    const createdAddress = await address.save();
    res.status(201).json(createdAddress);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAddresses = asyncHandler(async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.status(200).json(addresses);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  try {
    const address = await Address.findOne({
      _id: addressId,
      userId: req.user._id,
    });

    if (!address) {
      throw new Error("Address not found");
    }

    res.status(200).json(address);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  const { addressLine, city, state, postalCode, country, isDefault } = req.body;

  try {
    let address = await Address.findOne({
      _id: addressId,
      userId: req.user._id,
    });

    if (!address) {
      throw new Error("Address not found");
    }

    address.addressLine = addressLine;
    address.city = city;
    address.state = state;
    address.postalCode = postalCode;
    address.country = country;
    address.isDefault = isDefault;

    address = await address.save();
    res.status(200).json(address);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  try {
    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId: req.user._id,
    });

    if (!address) {
      throw new Error("Address not found");
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});
