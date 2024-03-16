/** @format */

import express, { Router } from "express";
import {
  createUpdateProductCategories,
  deleteProductCategory,
  getAllProductCategories,
} from "../contollers/productCategoryController";
import { productCategoryValidator } from "../validators/productCategoryValidator";

const router: Router = express.Router();

router.get("/getAllCategories", getAllProductCategories);
router.post(
  "/createUpdateCategory",
  productCategoryValidator,
  createUpdateProductCategories
);
router.delete("/deleteCategory/:id", deleteProductCategory);

export default router;
