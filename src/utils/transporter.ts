/** @format */
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
// Create and configure the nodemailer transporter

const transporter = nodemailer.createTransport({
  // Configure your email provider settings here
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER_ID,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export default transporter;
