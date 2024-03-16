/** @format */

import express, { Router } from "express";
import {
  createUpdateProduct,
  deleteProduct,
  getAddProductData,
  getAllProducts,
} from "../contollers/inventoryController";
import { inventoryValidator } from "../validators/inventoryValidators";

const router: Router = express.Router();

router.post(
  "/createUpdateProduct",
  // upload.single("image"),
  inventoryValidator,
  createUpdateProduct
);
router.get("/getAddProductData", getAddProductData);
router.get("/getAllProducts", getAllProducts);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;
