"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SupplierSchema = new mongoose_1.Schema({
    supplierName: {
        type: String,
        required: true,
    },
    supplierPAN: {
        type: String,
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});
SupplierSchema.virtual("id").get(function () {
    return this._id;
});
SupplierSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    },
});
const SupplierModal = (0, mongoose_1.model)("Supplier", SupplierSchema);
exports.default = SupplierModal;
