/** @format */

import { Schema, model } from "mongoose";
import { Customer } from "../interfaces/customerInterfaces";

const schema: Schema = new Schema<Customer>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phoneNumber: Number,
  address: String,
  gender: String,
  isActive: {
    type: Boolean,
    default: true,
  },
});

const customerModal = model<Customer>("Customer", schema);
export default customerModal;
