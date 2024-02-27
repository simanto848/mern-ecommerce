import mongoose from "mongoose";

const dbConfig = () => {
  try {
    const db = mongoose.connect(process.env.MONGO_URI);
    console.log("DATABASE CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.log("DATABASE CONNECTION FAILED!", error);
    throw new Error(error);
  }
};

export default dbConfig;
