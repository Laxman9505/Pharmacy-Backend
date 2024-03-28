/** @format */

import { Request, Response } from "express";
import moment from "moment";
import { IOrder } from "../interfaces/orderInterfaces";
import InventoryModel from "../modal/inventoryModal";
import orderModel from "../modal/orderModal";
import ProductCategoryModel from "../modal/productCategoryModal";
import { paginate } from "../utils/paginate";

export async function placeOrder(req: Request, res: Response) {
  try {
    // Generate the order ID

    const {
      customerDataModel,
      customerId,
      products,
      paymentMethod,
      orderDescription,
      totalPaymentAmount,
      orderStatus,
      paidAmount,
      remainingAmount,
      discountAmount,
      discountPercentage,
      orderNo,
    } = req.body;
    const newOrder = new orderModel({
      customerDataModel,
      customerId,
      products,
      paymentMethod,
      orderDescription,
      totalPaymentAmount,
      orderStatus,
      paidAmount,
      remainingAmount,
      orderNo,
      discountAmount,
      discountPercentage,
    });
    await newOrder.save();

    if (orderStatus == "Completed") {
      const receipt = await generateReceipt(newOrder);
      res.status(200).json({
        isPaymentCompleted: true,
        receipt: receipt,
      });
    } else {
      res.status(201).json({
        msg: "Order has been placed successfully !",
        order: newOrder,
        isPaymentCompleted: false,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "Something Went Wrong !" });
  }
}

export async function cancelOrder(req: Request, res: Response) {
  try {
    const orderId: string = req.params.id as string;
    const foundOrder: IOrder | null = await orderModel.findById(orderId);
    if (foundOrder) {
      if (foundOrder.orderStatus == "Cancelled") {
        return res
          .status(400)
          .json({ message: "Order is cancelled already !" });
      }
      foundOrder.orderStatus = "Cancelled";
      await foundOrder.save();
      res.status(200).json({
        message: `${foundOrder.orderNo} was cancelled successfully !`,
      });
    } else {
      res.status(400).json({ message: "Order Id not found !" });
    }
  } catch (error) {
    console.log("---error", error);
    res.status(200).json({ message: "Something Went Wrong" });
  }
}

export async function getOrderDetail(req: Request, res: Response) {
  try {
    const orderId: string = req.params.id as string;
    const order: IOrder | null = await orderModel.findById(orderId);
    const populatedProducts = await getPopulatedProductsFromOrder(
      order as IOrder
    );
    res.status(200).json({ products: populatedProducts });
  } catch (error) {
    res.status(200).json({ message: "Something Went Wrong" });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const perPage: number = parseInt(req.query.perPage as string) || 10;
    const searchKeyword: string = (req.query.searchKeyword as string) || "";

    const queryConditon =
      searchKeyword.trim().length > 0
        ? {
            $or: [
              {
                orderNo: { $regex: new RegExp(searchKeyword, "i") },
              },
            ],
          }
        : {};

    const PaginationResult = await paginate(
      orderModel,
      orderModel
        .find(queryConditon)
        .select(
          "customerDataModel.firstName customerDataModel.lastName orderNo paymentMethod orderStatus orderDate totalPaymentAmount"
        )
        .sort({ orderDate: -1 }),
      page,
      perPage,
      searchKeyword
    );

    res.status(200).json(PaginationResult);
  } catch (error) {
    console.log("---error", error);
    res.status(200).json({ message: "Something Went Wrong" });
  }
}

export async function getNewOrderCreationData(req: Request, res: Response) {
  try {
    // Fetch all categories
    const totalNoOfOrders: number = await orderModel.countDocuments();
    const searchKeyword: string = (req.query.searchKeyword as string) || "";
    const searchPattern: RegExp = new RegExp(searchKeyword, "i");

    const queryCondition =
      searchKeyword.trim().length > 0
        ? {
            $or: [
              {
                name: { $regex: searchPattern },
                manufacturer: { $regex: searchPattern },
              },
            ],
          }
        : {};

    const categories = await ProductCategoryModel.find(
      {},
      { _id: 1, categoryName: 1 }
    );

    // Fetch products and populate the 'category' field
    const productsByCategory = await InventoryModel.find(queryCondition)
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

    res.status(200).json({
      productsWithCategories: groupedProducts,
      orderNo: `#000${totalNoOfOrders + 1}`,
    });
  } catch (error) {}
}

async function generateReceipt(order: IOrder): Promise<any> {
  try {
    // Populate the product names using the productId field
    const populatedProducts = await getPopulatedProductsFromOrder(order);

    return {
      orderNo: order.orderNo,
      customerName: `${order.customerDataModel.firstName} ${order.customerDataModel.lastName}`,
      paymentMethod: order.paymentMethod,
      totalPaymentAmount: order.totalPaymentAmount,
      products: populatedProducts,
      discountAmount: order.discountAmount,
      orderDate: moment().format("YYYY-MM-DD"),
    };
  } catch (error) {
    console.error("Error generating receipt:", error);
    throw error;
  }
}

async function getPopulatedProductsFromOrder(order: IOrder) {
  const populatedProducts = await Promise.all(
    order.products.map(async (product) => {
      const pro: any = await InventoryModel.findById(product.productId, "name");

      return {
        productName: pro.name,
        quantity: product.quantity,
        boughtPrice: product.boughtPrice,
      };
    })
  );
  return populatedProducts;
}
