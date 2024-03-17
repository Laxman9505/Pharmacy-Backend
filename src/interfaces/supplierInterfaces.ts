/** @format */

export interface Supplier extends Document {
  _id?: Object;
  id?: string;
  supplierName: string;
  supplierPAN: string;
  description: string;
  isActive: boolean;
  // Add other fields as needed
}
