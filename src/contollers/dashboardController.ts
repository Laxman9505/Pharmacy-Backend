import { Request, Response } from "express";
import { IRequest } from "../interfaces/inventoryInterfaces";
import InventoryModel from "../modal/inventoryModal";
import orderModel from "../modal/orderModal";

export async function getDashboardData(req: Request, res: Response) {
  try {
    // Aggregate pipeline to calculate total stock amount
    const pipeline = [
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          totalStockAmount: { $multiply: ["$buyingPrice", "$quantityInStock"] }, // Multiply buyingPrice by quantityInStock for each document
        },
      },
      {
        $group: {
          _id: null,
          totalStockAmount: { $sum: "$totalStockAmount" }, // Sum up the multiplied values across all documents
        },
      },
    ];
    let totalStockAmount: number = 0;
    let totalProfit: number = 0;
    const results = await InventoryModel.aggregate(pipeline);

    const totalProfitResult = await orderModel.aggregate([
      // Join orders with products
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      // Unwind the products array
      { $unwind: "$productData" },
      // Project fields to calculate profit for each product
      {
        $project: {
          _id: 1,
          productProfit: {
            $multiply: [
              {
                $subtract: [
                  "$products.boughtPrice",
                  "$productData.buyingPrice",
                ],
              },
              "$products.quantity",
            ],
          },
        },
      },
      // Group by order and sum up profits
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$productProfit" },
        },
      },
    ]);

    if (results.length > 0) {
      totalStockAmount = results[0].totalStockAmount;
    }
    const allOrders: any[] = await orderModel.find();

    // Initialize total profit
    let totalProfits = 0;

    // Loop through each order
    for (const order of allOrders) {
      // Loop through each product in the order
      for (const product of order.products) {
        // Retrieve the buying price of the product from the database
        const pro: any = await InventoryModel.findById(product.productId);

        // Calculate profit for the product
        const profit =
          (product.boughtPrice - pro.buyingPrice) * product.quantity;

        // Add profit to total profit
        totalProfits += profit;
      }
    }

    // if (totalProfitResult.length > 0) {
    //   totalProfit = totalProfitResult[0].totalProfit;
    // }

    res.status(200).json({
      totalStockAmount,
      totalProfit,
      tpr: totalProfits,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
}
