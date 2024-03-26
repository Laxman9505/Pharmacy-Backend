"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Inventory", required: true },
    quantity: { type: Number, required: true },
    boughtPrice: { type: Number, required: true },
});
const customerDataModel = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phoneNumber: { type: Number },
    address: {
        type: String,
    },
});
// Define the Order schema
const OrderSchema = new mongoose_1.Schema({
    customerDataModel: customerDataModel,
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Customer" },
    products: [productSchema],
    discountAmount: { type: Number },
    orderNo: { type: String },
    discountPercentage: { type: Number },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Esewa", "PhonePay"],
        required: true,
    },
    orderDescription: { type: String },
    totalPaymentAmount: { type: Number, required: true },
    orderStatus: {
        type: String,
        enum: ["Pending", "Completed"],
        required: true,
    },
    paidAmount: { type: Number, required: true },
    remainingAmount: { type: Number },
    orderDate: {
        type: String,
        required: true,
        default: Date.now().toString(),
    },
}, {
    timestamps: true,
});
const orderModel = mongoose_1.default.model("Order", OrderSchema);
exports.default = orderModel;
