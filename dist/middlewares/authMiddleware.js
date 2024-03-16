"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { SIGNATURE } = process.env; // Replace with your actual secret key
const authMiddleware = (req, // Use the extended interface
res, next) => {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) {
        return res
            .status(401)
            .json({ message: "No Authorization header, authorization denied" });
    }
    const [bearer, token] = authorizationHeader.split(" ");
    if (!token || bearer.toLowerCase() !== "bearer") {
        return res
            .status(401)
            .json({ message: "Invalid Authorization header format" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SIGNATURE);
        req.user = decoded.user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Your session has been expired !" });
    }
};
exports.default = authMiddleware;
