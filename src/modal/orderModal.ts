/** @format */

import mongoose, { Schema } from "mongoose";
import { Customer } from "../interfaces/customerInterfaces";
import { IOrder, Product } from "../interfaces/orderInterfaces";

const productSchema: Schema = new Schema<Product>({
  productId: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
  quantity: { type: Number, required: true },
  boughtPrice: { type: Number, required: true },
});

const customerDataModel: Schema<Customer> = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phoneNumber: { type: Number },
  address: {
    type: String,
  },
});

// Define the Order schema
const OrderSchema: Schema = new Schema<IOrder>(
  {
    customerDataModel: customerDataModel,
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
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
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default orderModel;
