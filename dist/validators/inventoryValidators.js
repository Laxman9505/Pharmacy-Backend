"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryValidator = void 0;
const express_validator_1 = require("express-validator");
const inventoryValidationRules = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Item Name is required."),
    (0, express_validator_1.body)("category").notEmpty().withMessage("category is required."),
    (0, express_validator_1.body)("manufacturer").notEmpty().withMessage("manufacturer is required."),
    (0, express_validator_1.body)("manufactureDate")
        .notEmpty()
        .withMessage("Manufacture Date is required."),
    (0, express_validator_1.body)("reorderLevel").notEmpty().withMessage("Reorder level is required."),
    (0, express_validator_1.body)("quantityInStock")
        .isNumeric()
        .withMessage("Quantity in stock must be a number."),
    (0, express_validator_1.body)("expirationDate").notEmpty().withMessage("Expiration Date is required."),
    (0, express_validator_1.body)("isActive").isBoolean().withMessage("IsActive must be a boolean."),
    (0, express_validator_1.body)("buyingPrice").notEmpty().withMessage("Buying Price is required !"),
    (0, express_validator_1.body)("price").notEmpty().withMessage("Price is required"),
];
const inventoryValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all(inventoryValidationRules.map((validator) => validator(req, res, () => { })));
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            return res.status(400).json({ message: errorMessage });
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.inventoryValidator = inventoryValidator;
