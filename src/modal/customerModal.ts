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

schema.virtual("id").get(function (this: Customer) {
  return this._id;
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const customerModal = model<Customer>("Customer", schema);
export default customerModal;
