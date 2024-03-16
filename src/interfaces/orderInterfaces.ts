/** @format */
import { Document } from "mongoose";

export interface IOrder extends Document {
  OrderId?: string;
  CustomerName: string;
  CustomerAddress: string;
  TotalAmount: string;
  OrderStatus: string;
  OrderDate: string;
  CountryId: string;
  CityId: string;
  ProductList: Product[];
  OrderDescription: string;
}

export interface Product {
  Id: string;
  ProductName: string;
}
