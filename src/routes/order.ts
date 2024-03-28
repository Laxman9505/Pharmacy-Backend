/** @format */

import express, { Router } from "express";
import {
  cancelOrder,
  getAllOrders,
  getNewOrderCreationData,
  getOrderDetail,
  placeOrder,
} from "../contollers/orderController";

const router: Router = express.Router();

router.post("/placeOrder", placeOrder);
router.get("/getAllOrders", getAllOrders);
router.get("/getOrderDetail/:id", getOrderDetail);
router.get("/cancelOrder/:id", cancelOrder);
router.get("/getNewOrderCreationData", getNewOrderCreationData);

export default router;
