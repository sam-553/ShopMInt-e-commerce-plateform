import dotenv from "dotenv";

dotenv.config({
  path: "./config/config.env",
});
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import cloudinaryModule from "cloudinary";

// Local imports
import connectDb from "./config/connection.js";
import productrouter from "./routes/productRoutes.js";
import userrouter from "./routes/userRoutes.js";
import orderrouter from "./routes/orderRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";
import HandleErrorMiddleware from "./middlewear/error.js";

connectDb();




const app = express();

const port = process.env.PORT || 5000;

// ========================================
// CORS CONFIGURATION
// ========================================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


app.use(cookieParser());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  })
);


const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is running",
  });
});


app.use("/api/product", productrouter);
app.use("/api/user", userrouter);
app.use("/api/order", orderrouter);
app.use("/api/payment", paymentrouter);


app.use(HandleErrorMiddleware);


app.listen(port, () => {
  console.log(
    `✅ Server running on http://localhost:${port}`
  );
});