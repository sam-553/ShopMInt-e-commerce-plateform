import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config({
  path: "./config/config.env",
});

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export default instance;