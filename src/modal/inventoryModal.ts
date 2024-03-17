/** @format */

import { Schema, model } from "mongoose";
import { IInventory, IRequest } from "../interfaces/inventoryInterfaces";

const InventorySchema: Schema = new Schema<IRequest>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
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
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);

const InventoryModel = model<IInventory>("Inventory", InventorySchema);
export default InventoryModel;
