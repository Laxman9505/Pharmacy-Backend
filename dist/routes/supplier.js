"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplierController_1 = require("../contollers/supplierController");
const router = express_1.default.Router();
router.get("/getAllSuppliers", supplierController_1.getAllSuppliers);
router.post("/createUpdateSupplier", supplierController_1.createUpdateSupplier);
router.delete("/deleteSupplier/:id", supplierController_1.deleteSupplier);
exports.default = router;
