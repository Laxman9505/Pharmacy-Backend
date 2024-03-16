/** @format */

import express, { Router } from "express";
import {
  createUpdateCustomer,
  deleteCustomer,
  getAllCustomer,
} from "../contollers/customerController";
import { customerValidator } from "../validators/customerValidators";

const router: Router = express.Router();

router.post("/createUpdateCustomer", customerValidator, createUpdateCustomer);
router.get("/getAllCustomers", getAllCustomer);
router.delete("/deleteCustomer/:id", deleteCustomer);

export default router;
