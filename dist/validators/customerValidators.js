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
exports.customerValidator = void 0;
const express_validator_1 = require("express-validator");
const validationRules = [
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("phoneNumber").isNumeric().withMessage("Phone must be number"),
    (0, express_validator_1.body)("isActive").isBoolean().withMessage("IsActive must be a boolean."),
];
const customerValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all(validationRules.map((validator) => validator(req, res, () => { })));
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            return res.status(400).json({ message: errorMessage });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong !" });
    }
});
exports.customerValidator = customerValidator;
