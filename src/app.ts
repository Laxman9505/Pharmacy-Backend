/** @format */

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import customerRouter from "./routes/customer";
import productRouter from "./routes/inventory";
import orderRouter from "./routes/order";
import productCategoriesRouter from "./routes/productCategory";
import { CustomError, IErrorResponse } from "./utils/error-handler";
import { logAPICall } from "./utils/logger";

dotenv.config();

// import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cookieParser());

// Middleware
app.use(cors({ origin: "https://localhost:3000" }));
app.use(express.json());
app.use(express.static("public"));
app.use(logAPICall);
// Mount the authentication routes
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/product-category", productCategoriesRouter);
app.use("/customer", customerRouter);

app.use(
  (error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.serializeError());
    }
    next(error);
  }
);

// MongoDB Connection

const mongoURI =
  "mongodb+srv://Laxman9505:UhTMjAzyQWsqg8Ml@cluster0.djr7azy.mongodb.net/?retryWrites=true&w=majority" ||
  ""; // Replace 'mydatabase' with your actual database name
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
// app.use("/users", userRoutes);

export default app;
