/** @format */

import { Schema, model } from "mongoose";
import { IProductCategory } from "../interfaces/inventoryInterfaces";

const ProductCategorySchema: Schema = new Schema<IProductCategory>({
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

ProductCategorySchema.virtual("id").get(function (this: IProductCategory) {
  return this._id;
});

ProductCategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const ProductCategoryModel = model<IProductCategory>(
  "ProductCategory",
  ProductCategorySchema
);
export default ProductCategoryModel;
