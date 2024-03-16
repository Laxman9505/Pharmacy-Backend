/** @format */

import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interfaces/orderInterfaces";

// Define the Order schema
const OrderSchema: Schema = new Schema<IOrder>({
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

const orderModel = mongoose.model<IOrder>("Orders", OrderSchema);

export default orderModel;
