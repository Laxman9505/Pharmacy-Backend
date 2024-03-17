"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InventorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    buyingPrice: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ProductCategory",
        required: true,
    },
    manufacturer: {
        type: String,
    },
    manufactureDate: {
        type: Date,
        required: true,
    },
    formulation: {
        type: String,
    },
    strength: {
        type: String,
    },
    reorderLevel: {
        type: Number,
    },
    quantityInStock: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    barcode: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
    imageUrl: {
        type: String,
    },
    invoiceNo: {
        type: String,
    },
    invoiceDate: {
        type: String,
    },
    blockNo: {
        type: String,
    },
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
});
const InventoryModel = (0, mongoose_1.model)("Inventory", InventorySchema);
exports.default = InventoryModel;
