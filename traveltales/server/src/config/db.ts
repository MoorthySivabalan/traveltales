import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected successfully! `);
  } catch (error: any) {
    console.error(`DB connection failed: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;