"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../contollers/customerController");
const customerValidators_1 = require("../validators/customerValidators");
const router = express_1.default.Router();
router.post("/createUpdateCustomer", customerValidators_1.customerValidator, customerController_1.createUpdateCustomer);
router.get("/getAllCustomers", customerController_1.getAllCustomer);
router.delete("/deleteCustomer/:id", customerController_1.deleteCustomer);
exports.default = router;
