"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../contollers/orderController");
const router = express_1.default.Router();
router.post("/placeOrder", orderController_1.placeOrder);
router.get("/getAllOrders", orderController_1.getAllOrders);
router.get("/getNewOrderCreationData", orderController_1.getNewOrderCreationData);
exports.default = router;
