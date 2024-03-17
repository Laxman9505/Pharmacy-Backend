/** @format */

import { Schema, model } from "mongoose";
import { Supplier } from "../interfaces/supplierInterfaces";

const SupplierSchema: Schema = new Schema<Supplier>({
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

SupplierSchema.virtual("id").get(function (this: Supplier) {
  return this._id;
});

SupplierSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const SupplierModal = model<Supplier>("Supplier", SupplierSchema);
export default SupplierModal;
