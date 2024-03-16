"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventoryController_1 = require("../contollers/inventoryController");
const inventoryValidators_1 = require("../validators/inventoryValidators");
const router = express_1.default.Router();
router.post("/createUpdateProduct", 
// upload.single("image"),
inventoryValidators_1.inventoryValidator, inventoryController_1.createUpdateProduct);
router.get("/getAddProductData", inventoryController_1.getAddProductData);
router.get("/getAllProducts", inventoryController_1.getAllProducts);
router.delete("/deleteProduct/:id", inventoryController_1.deleteProduct);
exports.default = router;
