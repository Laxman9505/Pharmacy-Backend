"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../contollers/authController");
const multer_config_1 = __importDefault(require("../services/multer-config"));
const router = express_1.default.Router();
// Endpoint to send OTP code to user's email during registration
router.post("/send-otp", authController_1.sendOtpCodeToEmailOnBoarding);
// Endpoint to onboard a user
router.post("/onboard", multer_config_1.default.single("image"), authController_1.onBoardUser);
router.post("/verify-otp-and-login", authController_1.validateOTP);
// Endpoint to login a user
router.post("/login", authController_1.login);
exports.default = router;
