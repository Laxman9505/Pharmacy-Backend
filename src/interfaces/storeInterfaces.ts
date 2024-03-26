import { Document } from "mongoose";

export interface StoreInterface extends Document {
  storeDetails: StoreDetails;
  receiptConfiguration: ReceiptConfiguration;
  printerConfiguration: PrinterConfiguration;
}

export interface StoreDetails {
  name: string;
  location: string;
  phoneNumber: number;
  email: string;
  currencySymbol: string;
}

export interface ReceiptConfiguration {
  receiptHeaderText: string;
  receiptFooterText: string;
}

export interface PrinterConfiguration {
  printerName: string;
  paperSize: string;
  printerIPAddress: string;
  port: string;
}
