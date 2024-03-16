/** @format */

import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/authInterfaces";

// Define the User schema
const UserSchema: Schema = new Schema({
  FullName: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  ConfirmPassword: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  UserImage: { type: String },
  PreviousPasswords: [{ type: String }], // Array to store previous passwords
  PasswordLastChanged: { type: Date, default: Date.now }, // Timestamp of last password change
  PasswordExpiryDays: { type: Number, default: 90 }, // Password expiry in days
  FailedLoginAttempts: { type: Number, default: 0 }, // Number of failed login attempts
  LastFailedLogin: { type: Date }, // Timestamp of the last failed login attempt
  LockoutEndTime: { type: Date }, // Timestamp indicating when the lockout ends
});

// Middleware to hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (user.isModified("Password")) {
    user.PasswordLastChanged = Date.now();
    // Add the current password to the list of previous passwords
    user.PreviousPasswords?.push(user.Password);
  }
  next();
});

const userModel = mongoose.model<IUser>("Users", UserSchema);

export default userModel;
