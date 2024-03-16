"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onBoardUserValidator = void 0;
const express_validator_1 = require("express-validator");
exports.onBoardUserValidator = [
    (0, express_validator_1.body)("OTP").notEmpty().withMessage("OTP is required"),
    (0, express_validator_1.body)("FullName").notEmpty().withMessage("Full Name is required"),
    (0, express_validator_1.body)("Password").notEmpty().withMessage("Password is required"),
    (0, express_validator_1.body)("Email").notEmpty().withMessage("Email is required"),
    (0, express_validator_1.body)("PhoneNumber").notEmpty().withMessage("Phone Number is required"),
];
