/** @format */

import { Request, Response } from "express";
import mongoose from "mongoose";
import { Customer } from "../interfaces/customerInterfaces";
import customerModal from "../modal/customerModal";
import { paginate } from "../utils/paginate";

export async function createUpdateCustomer(req: Request, res: Response) {
  try {
    const RequestBody = req.body;
    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      gender,
      isActive,
      address,
    } = RequestBody as Customer;

    const request = {
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      gender,
      isActive,
      address,
    };

    if (id) {
      await customerModal.findByIdAndUpdate(id, {
        ...request,
      });
      return res.status(200).json({
        message: "Customer Updated Successfully !",
      });
    } else {
      const isAlreadyExistingCustomer: Customer | null =
        await customerModal.findOne({ firstName: firstName });
      if (isAlreadyExistingCustomer) {
        return res.status(400).json({ message: "Customer Already Exists !" });
      }
      const customer = new customerModal(request);
      // Save the inventory to the database
      await customer.save();
      res.status(201).json({ message: "Customer created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong !" });
  }
}

export async function getAllCustomer(req: Request, res: Response) {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const perPage: number = parseInt(req.query.perPage as string) || 10;
    const searchKeyword: string = (req.query.searchKeyword as string) || "";
    const searchPattern: RegExp = new RegExp(searchKeyword, "i");

    const queryCondition =
      searchKeyword.trim().length > 0
        ? {
            $or: [
              { firstName: { $regex: searchPattern } },
              { lastName: { $regex: searchPattern } },
              { email: { $regex: searchPattern } },
            ],
          }
        : {};

    const PaginationResult = await paginate(
      customerModal as any,
      customerModal.find(queryCondition),
      page,
      perPage
    );
    res.status(200).json(PaginationResult);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  try {
    const toBeDeletedId: string = req.params.id;
    console.log("to be deleted id ", toBeDeletedId);
    const validObjectId = mongoose.Types.ObjectId.isValid(toBeDeletedId);

    if (!validObjectId) {
      res.status(400).json({ message: "Invalid Customer ID" });
      return;
    }

    const deletedCustomer = await customerModal.findByIdAndRemove(
      toBeDeletedId
    );
    if (!deletedCustomer) {
      res.status(404).json({ message: "Customer not found!" });
    } else {
      res.status(200).json({ message: "Customer Deleted Successfully!" });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
