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
exports.deleteProduct = exports.getAddProductData = exports.getAllProducts = exports.createUpdateProduct = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inventoryModal_1 = __importDefault(require("../modal/inventoryModal"));
const productCategoryModal_1 = __importDefault(require("../modal/productCategoryModal"));
const paginate_1 = require("../utils/paginate");
function createUpdateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const RequestBody = req.body;
            const { id, name, category, manufacturer, manufactureDate, formulation, strength, reorderLevel, quantityInStock, expirationDate, description, barcode, isActive, buyingPrice, price, invoiceNo, invoiceDate, blockNo, } = RequestBody;
            // Create a new request object
            const request = {
                name,
                category,
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
                yield inventoryModal_1.default.findByIdAndUpdate(id, Object.assign({}, request));
                return res.status(200).json({
                    message: "Product Updated Successfully !",
                });
            }
            else {
                const isAlreadyExistingProduct = yield inventoryModal_1.default.findOne({ name: name });
                if (isAlreadyExistingProduct) {
                    return res.status(400).json({ message: "Product Already Exists !" });
                }
                const inventory = new inventoryModal_1.default(request);
                // Save the inventory to the database
                yield inventory.save();
                res.status(201).json({ message: "Product created successfully" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong !" });
        }
    });
}
exports.createUpdateProduct = createUpdateProduct;
function getAllProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 30;
            const searchKeyword = req.query.searchKeyword || "";
            const queryCondition = searchKeyword.trim().length > 0
                ? {
                    $or: [
                        { name: { $regex: new RegExp(searchKeyword, "i") } },
                        { manufacturer: { $regex: new RegExp(searchKeyword, "i") } },
                    ],
                }
                : {};
            const PaginationResult = yield (0, paginate_1.paginate)(inventoryModal_1.default, inventoryModal_1.default.find(queryCondition).populate({
                path: "category",
                model: "ProductCategory",
                select: "categoryName", // Field to select from the referenced model
            }), page, perPage);
            res.status(200).json(PaginationResult);
        }
        catch (error) {
            console.log("error", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
exports.getAllProducts = getAllProducts;
function getAddProductData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield productCategoryModal_1.default.find({
                isActive: true,
            }).select("categoryName");
            const response = {
                productCategories: categories,
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
exports.getAddProductData = getAddProductData;
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const toBeDeletedId = req.params.id;
            console.log("to be deleted id ", toBeDeletedId);
            const validObjectId = mongoose_1.default.Types.ObjectId.isValid(toBeDeletedId);
            if (!validObjectId) {
                res.status(400).json({ message: "Invalid Product ID" });
                return;
            }
            const deletedProduct = yield inventoryModal_1.default.findByIdAndRemove(toBeDeletedId);
            if (!deletedProduct) {
                res.status(404).json({ message: "Product not found!" });
            }
            else {
                res.status(200).json({ message: "Product Deleted Successfully!" });
            }
        }
        catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
exports.deleteProduct = deleteProduct;
