/** @format */

import express, { Router } from "express";
import {
  createUpdateSupplier,
  deleteSupplier,
  getAllSuppliers,
} from "../contollers/supplierController";

const router: Router = express.Router();

router.get("/getAllSuppliers", getAllSuppliers);
router.post("/createUpdateSupplier", createUpdateSupplier);
router.delete("/deleteSupplier/:id", deleteSupplier);

export default router;
