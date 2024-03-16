/** @format */

import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProductCategory } from "../interfaces/inventoryInterfaces";
import ProductCategoryModel from "../modal/productCategoryModal";
import { paginate } from "../utils/paginate";

export async function getAllProductCategories(req: Request, res: Response) {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 1;

    const paginationResult = await paginate(
      ProductCategoryModel,
      ProductCategoryModel.find(),
      page,
      pageSize
    );
    res.status(200).json(paginationResult);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function createUpdateProductCategories(
  req: Request,
  res: Response
) {
  try {
    const RequestBody = req.body;
    const { categoryName, description, isActive, id } =
      RequestBody as IProductCategory;

    const request = { categoryName, description, isActive };

    if (id) {
      await ProductCategoryModel.findByIdAndUpdate(id, { ...request });
      return res.status(200).json({
        message: "Product Category Updated Successfully !",
      });
    } else {
      const isAlreadyExistingCategory: IProductCategory | null =
        await ProductCategoryModel.findOne({ categoryName: categoryName });
      if (isAlreadyExistingCategory) {
        return res
          .status(400)
          .json({ message: "Product Category Already Exists !" });
      }
      const productCategory = new ProductCategoryModel(request);
      await productCategory.save();
      res
        .status(201)
        .json({ message: "Product category created successfully !" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
}

export async function deleteProductCategory(req: Request, res: Response) {
  try {
    const toBeDeletedId: string = req.params.id;
    const validObjectId = mongoose.Types.ObjectId.isValid(toBeDeletedId);

    if (!validObjectId) {
      res.status(400).json({ message: "Invalid Product Category ID" });
      return;
    }

    const deletedProductCategory: IProductCategory | null =
      await ProductCategoryModel.findByIdAndRemove(toBeDeletedId);

    if (!deletedProductCategory) {
      res.status(400).json({ message: "Product category not found !" });
    } else {
      res.status(200).json({ message: "Category deleted successfully !" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
}
