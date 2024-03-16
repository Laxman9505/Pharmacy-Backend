/** @format */

import mongoose, { Schema } from "mongoose";
import { IOtp } from "../interfaces/authInterfaces";

// Define the OTP schema
const OtpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

// Create the OTP model
const OtpModel = mongoose.model<IOtp>("Otp", OtpSchema);

export default OtpModel;
