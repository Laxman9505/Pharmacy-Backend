/** @format */

export interface Customer extends Document {
  _id?: Object;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  address: string;
  gender: string;
  isActive: boolean;
  // Add other fields as needed
}
