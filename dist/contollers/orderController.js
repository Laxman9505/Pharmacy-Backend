"use strict";
/** @format */
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
exports.getNewOrderCreationData = exports.getAllOrders = exports.getOrderDetail = exports.cancelOrder = exports.placeOrder = void 0;
const moment_1 = __importDefault(require("moment"));
const inventoryModal_1 = __importDefault(require("../modal/inventoryModal"));
const orderModal_1 = __importDefault(require("../modal/orderModal"));
const productCategoryModal_1 = __importDefault(require("../modal/productCategoryModal"));
const paginate_1 = require("../utils/paginate");
function placeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate the order ID
            const { customerDataModel, customerId, products, paymentMethod, orderDescription, totalPaymentAmount, orderStatus, paidAmount, remainingAmount, discountAmount, discountPercentage, orderNo, } = req.body;
            const newOrder = new orderModal_1.default({
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
            yield newOrder.save();
            if (orderStatus == "Completed") {
                const receipt = yield generateReceipt(newOrder);
                res.status(200).json({
                    isPaymentCompleted: true,
                    receipt: receipt,
                });
            }
            else {
                res.status(201).json({
                    msg: "Order has been placed successfully !",
                    order: newOrder,
                    isPaymentCompleted: false,
                });
            }
        }
        catch (error) {
            console.log("error", error);
            res.status(400).json({ message: "Something Went Wrong !" });
        }
    });
}
exports.placeOrder = placeOrder;
function cancelOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orderId = req.params.id;
            const foundOrder = yield orderModal_1.default.findById(orderId);
            if (foundOrder) {
                if (foundOrder.orderStatus == "Cancelled") {
                    return res
                        .status(400)
                        .json({ message: "Order is cancelled already !" });
                }
                foundOrder.orderStatus = "Cancelled";
                yield foundOrder.save();
                res.status(200).json({
                    message: `${foundOrder.orderNo} was cancelled successfully !`,
                });
            }
            else {
                res.status(400).json({ message: "Order Id not found !" });
            }
        }
        catch (error) {
            console.log("---error", error);
            res.status(200).json({ message: "Something Went Wrong" });
        }
    });
}
exports.cancelOrder = cancelOrder;
function getOrderDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orderId = req.params.id;
            const order = yield orderModal_1.default.findById(orderId);
            const populatedProducts = yield getPopulatedProductsFromOrder(order);
            res.status(200).json({ products: populatedProducts });
        }
        catch (error) {
            res.status(200).json({ message: "Something Went Wrong" });
        }
    });
}
exports.getOrderDetail = getOrderDetail;
function getAllOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 10;
            const searchKeyword = req.query.searchKeyword || "";
            const queryConditon = searchKeyword.trim().length > 0
                ? {
                    $or: [
                        {
                            orderNo: { $regex: new RegExp(searchKeyword, "i") },
                        },
                    ],
                }
                : {};
            const PaginationResult = yield (0, paginate_1.paginate)(orderModal_1.default, orderModal_1.default
                .find(queryConditon)
                .select("customerDataModel.firstName customerDataModel.lastName orderNo paymentMethod orderStatus orderDate totalPaymentAmount")
                .sort({ orderDate: -1 }), page, perPage, searchKeyword);
            res.status(200).json(PaginationResult);
        }
        catch (error) {
            console.log("---error", error);
            res.status(200).json({ message: "Something Went Wrong" });
        }
    });
}
exports.getAllOrders = getAllOrders;
function getNewOrderCreationData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch all categories
            const totalNoOfOrders = yield orderModal_1.default.countDocuments();
            const searchKeyword = req.query.searchKeyword || "";
            const searchPattern = new RegExp(searchKeyword, "i");
            const queryCondition = searchKeyword.trim().length > 0
                ? {
                    $or: [
                        {
                            name: { $regex: searchPattern },
                            manufacturer: { $regex: searchPattern },
                        },
                    ],
                }
                : {};
            const categories = yield productCategoryModal_1.default.find({}, { _id: 1, categoryName: 1 });
            // Fetch products and populate the 'category' field
            const productsByCategory = yield inventoryModal_1.default.find(queryCondition)
                .populate("category", "categoryName")
                .lean();
            // Organize products by category
            const groupedProducts = categories.map((category) => ({
                categoryId: category._id,
                categoryName: category.categoryName,
                products: productsByCategory.filter((product) => { var _a; return (_a = product.category) === null || _a === void 0 ? void 0 : _a._id.equals(category._id); }),
            }));
            res.status(200).json({
                productsWithCategories: groupedProducts,
                orderNo: `#000${totalNoOfOrders + 1}`,
            });
        }
        catch (error) { }
    });
}
exports.getNewOrderCreationData = getNewOrderCreationData;
function generateReceipt(order) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Populate the product names using the productId field
            const populatedProducts = yield getPopulatedProductsFromOrder(order);
            return {
                orderNo: order.orderNo,
                customerName: `${order.customerDataModel.firstName} ${order.customerDataModel.lastName}`,
                paymentMethod: order.paymentMethod,
                totalPaymentAmount: order.totalPaymentAmount,
                products: populatedProducts,
                discountAmount: order.discountAmount,
                orderDate: (0, moment_1.default)().format("YYYY-MM-DD"),
            };
        }
        catch (error) {
            console.error("Error generating receipt:", error);
            throw error;
        }
    });
}
function getPopulatedProductsFromOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const populatedProducts = yield Promise.all(order.products.map((product) => __awaiter(this, void 0, void 0, function* () {
            const pro = yield inventoryModal_1.default.findById(product.productId, "name");
            return {
                productName: pro.name,
                quantity: product.quantity,
                boughtPrice: product.boughtPrice,
            };
        })));
        return populatedProducts;
    });
}
