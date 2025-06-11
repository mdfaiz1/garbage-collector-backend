import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${process.env.DB_NAME}`
    );
    console.log(`\n MongoDB connected !! DB Host : ${connectionInstance}`);
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
