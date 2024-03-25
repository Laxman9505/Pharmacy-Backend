"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../contollers/dashboardController");
const router = express_1.default.Router();
router.get("/getDashboardData", dashboardController_1.getDashboardData);
exports.default = router;
