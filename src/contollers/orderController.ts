/** @format */

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import InventoryModel from "../modal/inventoryModal";
import orderModel from "../modal/orderModal";
import ProductCategoryModel from "../modal/productCategoryModal";
import { paginate } from "../utils/paginate";

export async function placeOrder(req: Request, res: Response) {
  try {
    // Generate the order ID
    const orderId = uuidv4();
    const { ProductList, CustomerName, CustomerAddress, TotalAmount } =
      req.body;
    const newOrder = new orderModel({
      OrderId: orderId,
      CustomerName: CustomerName,
      CustomerAddress: CustomerAddress,
      ProductList: ProductList,
      TotalAmount: TotalAmount,
      OrderStatus: "Placed",
      OrderDate: Date.now().toString(),
    });
    await newOrder.save();
    res
      .status(201)
      .json({ msg: "Order m been placed successfully !", order: newOrder });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "Something Went Wrong !" });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const perPage: number = parseInt(req.query.perPage as string) || 10;
    const PaginationResult = await paginate(orderModel, {}, page, perPage);

    console.log("pagination result", PaginationResult);
    res.status(200).json(PaginationResult);
  } catch (error) {
    res.status(200).json({ message: "Something Went Wrong" });
  }
}

export async function getNewOrderCreationData(req: Request, res: Response) {
  try {
    // Fetch all categories
    const categories = await ProductCategoryModel.find(
      {},
      { _id: 1, categoryName: 1 }
    );

    // Fetch products and populate the 'category' field
    const productsByCategory = await InventoryModel.find({})
      .populate("category", "categoryName")
      .lean();

    // Organize products by category
    const groupedProducts = categories.map((category) => ({
      categoryId: category._id,
      categoryName: category.categoryName,
      products: productsByCategory.filter((product: any) =>
        product.category?._id.equals(category._id)
      ),
    }));

    res.status(200).json({ productsWithCategories: groupedProducts });
    console.log("---product by cattegory", productsByCategory);
  } catch (error) {}
}
