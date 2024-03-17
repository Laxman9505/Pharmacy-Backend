/** @format */

import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProductCategory } from "../interfaces/inventoryInterfaces";
import { Supplier } from "../interfaces/supplierInterfaces";
import SupplierModal from "../modal/supplierModal";
import { paginate } from "../utils/paginate";

export async function getAllSuppliers(req: Request, res: Response) {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 1;

    const paginationResult = await paginate(
      SupplierModal as any,
      SupplierModal.find(),
      page,
      pageSize
    );
    res.status(200).json(paginationResult);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function createUpdateSupplier(req: Request, res: Response) {
  try {
    const RequestBody = req.body;
    const { supplierName, supplierPAN, description, isActive, id } =
      RequestBody as Supplier;

    const request = { supplierName, supplierPAN, description, isActive };

    if (id) {
      await SupplierModal.findByIdAndUpdate(id, { ...request });
      return res.status(200).json({
        message: "Supplier Updated Successfully !",
      });
    } else {
      const isAlreadyExistingCategory: IProductCategory | null =
        await SupplierModal.findOne({ supplierName: supplierName });
      if (isAlreadyExistingCategory) {
        return res.status(400).json({ message: "Supplier Already Exists !" });
      }
      const supplier = new SupplierModal(request);
      await supplier.save();
      res.status(201).json({ message: "Supplier created successfully !" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
}

export async function deleteSupplier(req: Request, res: Response) {
  try {
    const toBeDeletedId: string = req.params.id;
    const validObjectId = mongoose.Types.ObjectId.isValid(toBeDeletedId);

    if (!validObjectId) {
      res.status(400).json({ message: "Invalid Supplier ID" });
      return;
    }

    const deletedSupplier: Supplier | null =
      await SupplierModal.findByIdAndRemove(toBeDeletedId);

    if (!deletedSupplier) {
      res.status(400).json({ message: "Supplier not found !" });
    } else {
      res.status(200).json({ message: "Supplier deleted successfully !" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
}
