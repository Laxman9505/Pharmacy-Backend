import { Model, Schema, model } from "mongoose";
import {
  PrinterConfiguration,
  ReceiptConfiguration,
  StoreDetails,
  StoreInterface,
} from "../interfaces/storeInterfaces";

const storeDetailSchema: Schema = new Schema<StoreDetails>({
  name: { type: String, required: true },
  location: { type: String },
  phoneNumber: { type: Number },
  email: { type: String },
  currencySymbol: { type: String },
});

const receiptSchema: Schema = new Schema<ReceiptConfiguration>({
  receiptHeaderText: { type: String },
  receiptFooterText: { type: String, required: true },
});

const printerSchema: Schema = new Schema<PrinterConfiguration>({
  printerName: { type: String },
  paperSize: { type: String },
  printerIPAddress: { type: String, required: true },
  port: { type: String },
});

const storeSchema: Schema = new Schema<StoreInterface>({
  storeDetails: storeDetailSchema,
  receiptConfiguration: receiptSchema,
  printerConfiguration: printerSchema,
});

const storeModel = model<StoreInterface>("StoreDetail", storeSchema);

export default storeModel;
