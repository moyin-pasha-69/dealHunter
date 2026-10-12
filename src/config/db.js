import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully! ✅");
  } catch (error) {
    console.log("DB not connected", error);
  }
}

export default connectDB;
