/** @format */
import { Document, Schema } from "mongoose";
import { Customer } from "./customerInterfaces";

export interface IOrder extends Document {
  customerDataModel: Customer;
  totalPaymentAmount: Number;
  orderStatus: string;
  paymentMethod: string;
  customerId: Schema.Types.ObjectId;
  orderDate: string;
  products: Product[];
  orderDescription: string;
  paidAmount: number;
  remainingAmount: number;
  discountAmount: number;
  discountPercentage: number;
  orderNo: string;
}

export interface Product {
  id?: string;
  productId: Schema.Types.ObjectId;
  quantity: number;
  boughtPrice: number;
}
