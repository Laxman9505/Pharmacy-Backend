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
exports.getNewOrderCreationData = exports.getAllOrders = exports.placeOrder = void 0;
const uuid_1 = require("uuid");
const inventoryModal_1 = __importDefault(require("../modal/inventoryModal"));
const orderModal_1 = __importDefault(require("../modal/orderModal"));
const productCategoryModal_1 = __importDefault(require("../modal/productCategoryModal"));
const paginate_1 = require("../utils/paginate");
function placeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate the order ID
            const orderId = (0, uuid_1.v4)();
            const { ProductList, CustomerName, CustomerAddress, TotalAmount } = req.body;
            const newOrder = new orderModal_1.default({
                OrderId: orderId,
                CustomerName: CustomerName,
                CustomerAddress: CustomerAddress,
                ProductList: ProductList,
                TotalAmount: TotalAmount,
                OrderStatus: "Placed",
                OrderDate: Date.now().toString(),
            });
            yield newOrder.save();
            res
                .status(201)
                .json({ msg: "Order m been placed successfully !", order: newOrder });
        }
        catch (error) {
            console.log("error", error);
            res.status(400).json({ message: "Something Went Wrong !" });
        }
    });
}
exports.placeOrder = placeOrder;
function getAllOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 10;
            const PaginationResult = yield (0, paginate_1.paginate)(orderModal_1.default, {}, page, perPage);
            console.log("pagination result", PaginationResult);
            res.status(200).json(PaginationResult);
        }
        catch (error) {
            res.status(200).json({ message: "Something Went Wrong" });
        }
    });
}
exports.getAllOrders = getAllOrders;
function getNewOrderCreationData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch all categories
            const categories = yield productCategoryModal_1.default.find({}, { _id: 1, categoryName: 1 });
            // Fetch products and populate the 'category' field
            const productsByCategory = yield inventoryModal_1.default.find({})
                .populate("category", "categoryName")
                .lean();
            // Organize products by category
            const groupedProducts = categories.map((category) => ({
                categoryId: category._id,
                categoryName: category.categoryName,
                products: productsByCategory.filter((product) => { var _a; return (_a = product.category) === null || _a === void 0 ? void 0 : _a._id.equals(category._id); }),
            }));
            res.status(200).json({ productsWithCategories: groupedProducts });
            console.log("---product by cattegory", productsByCategory);
        }
        catch (error) { }
    });
}
exports.getNewOrderCreationData = getNewOrderCreationData;
