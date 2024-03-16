/** @format */

import { body } from "express-validator";

export const onBoardUserValidator = [
  body("OTP").notEmpty().withMessage("OTP is required"),
  body("FullName").notEmpty().withMessage("Full Name is required"),
  body("Password").notEmpty().withMessage("Password is required"),
  body("Email").notEmpty().withMessage("Email is required"),
  body("PhoneNumber").notEmpty().withMessage("Phone Number is required"),
];
