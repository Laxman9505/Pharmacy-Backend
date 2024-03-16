/** @format */

import express, { Router } from "express";
import {
  getAllOrders,
  getNewOrderCreationData,
  placeOrder,
} from "../contollers/orderController";

const router: Router = express.Router();

router.post("/placeOrder", placeOrder);
router.get("/getAllOrders", getAllOrders);
router.get("/getNewOrderCreationData", getNewOrderCreationData);

export default router;
