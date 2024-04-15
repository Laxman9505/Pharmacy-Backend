/** @format */

import { Request, Response } from "express";
import moment from "moment";
import { IRequest } from "../interfaces/inventoryInterfaces";
import { IOrder } from "../interfaces/orderInterfaces";
import InventoryModel from "../modal/inventoryModal";
import orderModel from "../modal/orderModal";
import storeModel from "../modal/storeModal";
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

    // Decrease the stock count of each product
    for (const { productId, quantity } of products) {
      // Find the product by its ID
      const product: IRequest | null = await InventoryModel.findById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Decrease the quantityInStock
      product.quantityInStock -= quantity;
      await product.save();
    }
    await newOrder.save();

    if (orderStatus == "Completed") {
      const storeDetail = await storeModel.findOne();
      const receipt = await generateReceipt(newOrder);
      res.status(200).json({
        isPaymentCompleted: true,
        receipt: receipt,
        storeDetail: storeDetail,
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
    const searchKeyword: string = (req.query.searchKeyword as string) || "";
    const searchPattern: RegExp = new RegExp(searchKeyword, "i");

    const queryCondition = {
      $or: [
        { name: { $regex: searchPattern } }, // Search by name
        { manufacturer: { $regex: searchPattern } }, // Search by manufacturer
        { formulation: { $regex: searchPattern } },
        { description: { $regex: searchPattern } },
      ],
    };

    // Fetch products and populate the 'category' field
    const products = await InventoryModel.find(queryCondition)
      .populate("category", "categoryName") // Populate category field with categoryName
      .lean();

    // Group products by category
    const groupedProducts = products.reduce((acc: any, product: any) => {
      const categoryId = product.category?._id.toString();
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId: categoryId,
          categoryName: product.category?.categoryName,
          products: [],
        };
      }
      acc[categoryId].products.push(product);
      return acc;
    }, {});

    res
      .status(200)
      .json({ productWithCategories: Object.values(groupedProducts) });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
