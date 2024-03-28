"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storeController_1 = require("../contollers/storeController");
const router = express_1.default.Router();
router.get("/getStoreDetail", storeController_1.getStoreDetail);
router.post("/saveStoreDetail", storeController_1.saveStoreDetail);
exports.default = router;
