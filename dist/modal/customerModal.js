"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phoneNumber: Number,
    address: String,
    gender: String,
    isActive: {
        type: Boolean,
        default: true,
    },
});
const customerModal = (0, mongoose_1.model)("Customer", schema);
exports.default = customerModal;
