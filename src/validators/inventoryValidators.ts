/** @format */

// validators.ts

import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const inventoryValidationRules = [
  body("name").notEmpty().withMessage("Item Name is required."),
  body("category").notEmpty().withMessage("category is required."),
  body("manufacturer").notEmpty().withMessage("manufacturer is required."),
  body("manufactureDate")
    .notEmpty()
    .withMessage("Manufacture Date is required."),
  body("reorderLevel").notEmpty().withMessage("Reorder level is required."),
  body("quantityInStock")
    .isNumeric()
    .withMessage("Quantity in stock must be a number."),
  body("expirationDate").notEmpty().withMessage("Expiration Date is required."),
  body("isActive").isBoolean().withMessage("IsActive must be a boolean."),
  body("buyingPrice").notEmpty().withMessage("Buying Price is required !"),
  body("price").notEmpty().withMessage("Price is required"),
];
export const inventoryValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all(
      inventoryValidationRules.map((validator) => validator(req, res, () => {}))
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
