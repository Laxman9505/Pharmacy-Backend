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
exports.deleteProductCategory = exports.createUpdateProductCategories = exports.getAllProductCategories = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productCategoryModal_1 = __importDefault(require("../modal/productCategoryModal"));
const paginate_1 = require("../utils/paginate");
function getAllProductCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 1;
            const paginationResult = yield (0, paginate_1.paginate)(productCategoryModal_1.default, productCategoryModal_1.default.find(), page, pageSize);
            res.status(200).json(paginationResult);
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
exports.getAllProductCategories = getAllProductCategories;
function createUpdateProductCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const RequestBody = req.body;
            const { categoryName, description, isActive, id } = RequestBody;
            const request = { categoryName, description, isActive };
            if (id) {
                yield productCategoryModal_1.default.findByIdAndUpdate(id, Object.assign({}, request));
                return res.status(200).json({
                    message: "Product Category Updated Successfully !",
                });
            }
            else {
                const isAlreadyExistingCategory = yield productCategoryModal_1.default.findOne({ categoryName: categoryName });
                if (isAlreadyExistingCategory) {
                    return res
                        .status(400)
                        .json({ message: "Product Category Already Exists !" });
                }
                const productCategory = new productCategoryModal_1.default(request);
                yield productCategory.save();
                res
                    .status(201)
                    .json({ message: "Product category created successfully !" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong !" });
        }
    });
}
exports.createUpdateProductCategories = createUpdateProductCategories;
function deleteProductCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const toBeDeletedId = req.params.id;
            const validObjectId = mongoose_1.default.Types.ObjectId.isValid(toBeDeletedId);
            if (!validObjectId) {
                res.status(400).json({ message: "Invalid Product Category ID" });
                return;
            }
            const deletedProductCategory = yield productCategoryModal_1.default.findByIdAndRemove(toBeDeletedId);
            if (!deletedProductCategory) {
                res.status(400).json({ message: "Product category not found !" });
            }
            else {
                res.status(200).json({ message: "Category deleted successfully !" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong !" });
        }
    });
}
exports.deleteProductCategory = deleteProductCategory;
