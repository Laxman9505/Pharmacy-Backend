"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const storeDetailSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    location: { type: String },
    phoneNumber: { type: Number },
    email: { type: String },
    currencySymbol: { type: String },
});
const receiptSchema = new mongoose_1.Schema({
    receiptHeaderText: { type: String },
    receiptFooterText: { type: String, required: true },
});
const printerSchema = new mongoose_1.Schema({
    printerName: { type: String },
    paperSize: { type: String },
    printerIPAddress: { type: String, required: true },
    port: { type: String },
});
const storeSchema = new mongoose_1.Schema({
    storeDetails: storeDetailSchema,
    receiptConfiguration: receiptSchema,
    printerConfiguration: printerSchema,
});
const storeModel = (0, mongoose_1.model)("StoreDetail", storeSchema);
exports.default = storeModel;
