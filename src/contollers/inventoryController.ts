/** @format */

import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProductCategory, IRequest } from "../interfaces/inventoryInterfaces";
import { Supplier } from "../interfaces/supplierInterfaces";
import InventoryModel from "../modal/inventoryModal";
import ProductCategoryModel from "../modal/productCategoryModal";
import SupplierModal from "../modal/supplierModal";
import { paginate } from "../utils/paginate";

export async function createUpdateProduct(req: Request, res: Response) {
  try {
    const RequestBody = req.body;
    const {
      id,
      name,
      category,
      supplier,
      manufacturer,
      manufactureDate,
      formulation,
      strength,
      reorderLevel,
      quantityInStock,
      expirationDate,
      description,
      barcode,
      isActive,
      buyingPrice,
      price,
      invoiceNo,
      invoiceDate,
      blockNo,
    } = RequestBody as IRequest;

    // Create a new request object
    const request = {
      name,
      category,
      supplier,
      manufacturer,
      manufactureDate,
      formulation,
      strength,
      reorderLevel,
      quantityInStock,
      expirationDate,
      description,
      barcode,
      isActive,
      buyingPrice,
      price,
      invoiceNo,
      invoiceDate,
      blockNo,
    };

    if (id) {
      await InventoryModel.findByIdAndUpdate(id, {
        ...request,
      });
      return res.status(200).json({
        message: "Product Updated Successfully !",
      });
    } else {
      const isAlreadyExistingProduct: IRequest | null =
        await InventoryModel.findOne({ name: name });
      if (isAlreadyExistingProduct) {
        return res.status(400).json({ message: "Product Already Exists !" });
      }
      const inventory = new InventoryModel(request);
      // Save the inventory to the database
      await inventory.save();
      res.status(201).json({ message: "Product created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong !" });
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const perPage: number = parseInt(req.query.pageSize as string) || 10;
    const searchKeyword: string = (req.query.searchKeyword as string) || "";

    const queryCondition =
      searchKeyword.trim().length > 0
        ? {
            $or: [
              { name: { $regex: new RegExp(searchKeyword, "i") } },
              { manufacturer: { $regex: new RegExp(searchKeyword, "i") } },
              { formulation: { $regex: new RegExp(searchKeyword, "i") } },
              { description: { $regex: new RegExp(searchKeyword, "i") } },
            ],
          }
        : {};

    const PaginationResult = await paginate(
      InventoryModel,
      InventoryModel.find(queryCondition).populate([
        {
          path: "category", // Field to populate
          model: "ProductCategory", // Model to reference
          select: "categoryName", // Field to select from the referenced model
        },
        {
          path: "supplier", // Field to populate
          model: "Supplier", // Model to reference
          select: "supplierName", // Field to select from the referenced model
        },
      ]),
      page,
      perPage,
      searchKeyword
    );
    res.status(200).json(PaginationResult);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getAddProductData(req: Request, res: Response) {
  try {
    const categories: IProductCategory[] = await ProductCategoryModel.find({
      isActive: true,
    }).select("categoryName");

    const suppliers: Supplier[] = await SupplierModal.find({
      isActive: true,
    }).select("supplierName");

    const response = {
      productCategories: categories,
      suppliers: suppliers,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const toBeDeletedId: string = req.params.id;
    console.log("to be deleted id ", toBeDeletedId);
    const validObjectId = mongoose.Types.ObjectId.isValid(toBeDeletedId);

    if (!validObjectId) {
      res.status(400).json({ message: "Invalid Product ID" });
      return;
    }

    const deletedProduct = await InventoryModel.findByIdAndRemove(
      toBeDeletedId
    );
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found!" });
    } else {
      res.status(200).json({ message: "Product Deleted Successfully!" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
