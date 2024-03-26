"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const inventoryModal_1 = __importDefault(require("../modal/inventoryModal"));
const orderModal_1 = __importDefault(require("../modal/orderModal"));
function getDashboardData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Aggregate pipeline to calculate total stock amount
            const pipeline = [
                {
                    $project: {
                        _id: 0,
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
            let totalStockAmount = 0;
            let totalProfit = 0;
            const results = yield inventoryModal_1.default.aggregate(pipeline);
            const totalProfitResult = yield orderModal_1.default.aggregate([
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
            const allOrders = yield orderModal_1.default.find();
            // Initialize total profit
            let totalProfits = 0;
            // Loop through each order
            for (const order of allOrders) {
                // Loop through each product in the order
                for (const product of order.products) {
                    // Retrieve the buying price of the product from the database
                    const pro = yield inventoryModal_1.default.findById(product.productId);
                    // Calculate profit for the product
                    const profit = (product.boughtPrice - pro.buyingPrice) * product.quantity;
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
        }
        catch (error) {
            console.log("error", error);
            res.status(500).json({ message: "Something Went Wrong" });
        }
    });
}
exports.getDashboardData = getDashboardData;
