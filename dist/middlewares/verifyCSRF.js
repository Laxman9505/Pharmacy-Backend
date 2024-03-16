"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = void 0;
const csrf = require("csurf");
// Setup csurf middleware
exports.csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
    },
});
