"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductCategorySchema = new mongoose_1.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});
ProductCategorySchema.virtual("id").get(function () {
    return this._id;
});
ProductCategorySchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    },
});
const ProductCategoryModel = (0, mongoose_1.model)("ProductCategory", ProductCategorySchema);
exports.default = ProductCategoryModel;
