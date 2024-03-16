"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @format */
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
// Create and configure the nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    // Configure your email provider settings here
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER_ID,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});
exports.default = transporter;
