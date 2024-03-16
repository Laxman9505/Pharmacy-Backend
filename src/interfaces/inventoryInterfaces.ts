/** @format */

import { Document, ObjectId } from "mongoose";

export interface IInventory extends Document {
  Request: IRequest;
  Image: Buffer;
}
// Interface for Item Object.

export interface IRequest extends Document {
  _id?: ObjectId;
  name: string;
  image: string;
  category: ObjectId;
  manufacturer: string;
  formulation: string;
  strength: string;
  quantityInStock: number;
  unitPrice: number;
  reorderLevel: number;
  manufactureDate: Date;
  expirationDate: Date;
  description: string;
  buyingPrice: number;
  price: number;
  barcode: string;
  isActive: boolean;
  imageUrl?: string;
  createdDate?: Date;
  updatedDate?: Date;
}
export interface IProductCategory extends Document {
  _id?: ObjectId;
  categoryName: string;
  description: string;
  isActive: boolean;
}
