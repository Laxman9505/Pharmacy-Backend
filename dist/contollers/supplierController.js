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
exports.deleteSupplier = exports.createUpdateSupplier = exports.getAllSuppliers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const supplierModal_1 = __importDefault(require("../modal/supplierModal"));
const paginate_1 = require("../utils/paginate");
function getAllSuppliers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 1;
            const searchKeyword = req.query.searchKeyword || "";
            const searchPattern = new RegExp(searchKeyword, "i");
            const queryCondition = searchKeyword.trim().length > 0
                ? {
                    $or: [
                        { supplierName: { $regex: searchPattern } },
                        { description: { $regex: searchPattern } },
                        { supplierPAN: { $regex: searchPattern } },
                    ],
                }
                : {};
            const paginationResult = yield (0, paginate_1.paginate)(supplierModal_1.default, supplierModal_1.default.find(queryCondition), page, pageSize);
            res.status(200).json(paginationResult);
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
exports.getAllSuppliers = getAllSuppliers;
function createUpdateSupplier(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const RequestBody = req.body;
            const { supplierName, supplierPAN, description, isActive, id } = RequestBody;
            const request = { supplierName, supplierPAN, description, isActive };
            if (id) {
                yield supplierModal_1.default.findByIdAndUpdate(id, Object.assign({}, request));
                return res.status(200).json({
                    message: "Supplier Updated Successfully !",
                });
            }
            else {
                const isAlreadyExistingCategory = yield supplierModal_1.default.findOne({ supplierName: supplierName });
                if (isAlreadyExistingCategory) {
                    return res.status(400).json({ message: "Supplier Already Exists !" });
                }
                const supplier = new supplierModal_1.default(request);
                yield supplier.save();
                res.status(201).json({ message: "Supplier created successfully !" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong !" });
        }
    });
}
exports.createUpdateSupplier = createUpdateSupplier;
function deleteSupplier(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const toBeDeletedId = req.params.id;
            const validObjectId = mongoose_1.default.Types.ObjectId.isValid(toBeDeletedId);
            if (!validObjectId) {
                res.status(400).json({ message: "Invalid Supplier ID" });
                return;
            }
            const deletedSupplier = yield supplierModal_1.default.findByIdAndRemove(toBeDeletedId);
            if (!deletedSupplier) {
                res.status(400).json({ message: "Supplier not found !" });
            }
            else {
                res.status(200).json({ message: "Supplier deleted successfully !" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong !" });
        }
    });
}
exports.deleteSupplier = deleteSupplier;
