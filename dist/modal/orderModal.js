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
// Define the Order schema
const OrderSchema = new mongoose_1.Schema({
    OrderId: { type: String },
    CustomerName: { type: String, required: true },
    CustomerAddress: { type: String, required: true },
    TotalAmount: { type: String, required: true },
    OrderStatus: { type: String, required: true },
    OrderDescription: { type: String },
    ProductList: {
        type: [
            {
                Id: { type: String, required: true },
                ProductName: { type: String, required: true },
                ProductImage: { type: String, required: true },
                ProductPrice: { type: String, required: true },
                ProductQuantity: { type: String, required: true },
            },
        ],
        required: true,
    },
    OrderDate: {
        type: String,
        required: true,
        default: Date.now().toString(),
    },
});
const orderModel = mongoose_1.default.model("Orders", OrderSchema);
exports.default = orderModel;
