"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productCategoryController_1 = require("../contollers/productCategoryController");
const productCategoryValidator_1 = require("../validators/productCategoryValidator");
const router = express_1.default.Router();
router.get("/getAllCategories", productCategoryController_1.getAllProductCategories);
router.post("/createUpdateCategory", productCategoryValidator_1.productCategoryValidator, productCategoryController_1.createUpdateProductCategories);
router.delete("/deleteCategory/:id", productCategoryController_1.deleteProductCategory);
exports.default = router;
