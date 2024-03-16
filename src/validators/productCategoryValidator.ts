/** @format */

import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const validationRules = [
  body("categoryName").notEmpty().withMessage("Category name is required"),
  body("isActive").isBoolean().withMessage("IsActive must be a boolean."),
];

export const productCategoryValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all(
      validationRules.map((validator) => validator(req, res, () => {}))
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};
