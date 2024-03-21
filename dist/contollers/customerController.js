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
exports.deleteCustomer = exports.getAllCustomer = exports.createUpdateCustomer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customerModal_1 = __importDefault(require("../modal/customerModal"));
const paginate_1 = require("../utils/paginate");
function createUpdateCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const RequestBody = req.body;
            const { id, firstName, lastName, phoneNumber, email, gender, isActive, address, } = RequestBody;
            const request = {
                id,
                firstName,
                lastName,
                phoneNumber,
                email,
                gender,
                isActive,
                address,
            };
            if (id) {
                yield customerModal_1.default.findByIdAndUpdate(id, Object.assign({}, request));
                return res.status(200).json({
                    message: "Customer Updated Successfully !",
                });
            }
            else {
                const isAlreadyExistingCustomer = yield customerModal_1.default.findOne({ firstName: firstName });
                if (isAlreadyExistingCustomer) {
                    return res.status(400).json({ message: "Customer Already Exists !" });
                }
                const customer = new customerModal_1.default(request);
                // Save the inventory to the database
                yield customer.save();
                res.status(201).json({ message: "Customer created successfully" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong !" });
        }
    });
}
exports.createUpdateCustomer = createUpdateCustomer;
function getAllCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.pageSize) || 10;
            const searchKeyword = req.query.searchKeyword || "";
            const searchPattern = new RegExp(searchKeyword, "i");
            const queryCondition = searchKeyword.trim().length > 0
                ? {
                    $or: [
                        { firstName: { $regex: searchPattern } },
                        { lastName: { $regex: searchPattern } },
                        { email: { $regex: searchPattern } },
                    ],
                }
                : {};
            const PaginationResult = yield (0, paginate_1.paginate)(customerModal_1.default, customerModal_1.default.find(queryCondition), page, perPage);
            res.status(200).json(PaginationResult);
        }
        catch (error) {
            console.log("error", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
exports.getAllCustomer = getAllCustomer;
function deleteCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const toBeDeletedId = req.params.id;
            console.log("to be deleted id ", toBeDeletedId);
            const validObjectId = mongoose_1.default.Types.ObjectId.isValid(toBeDeletedId);
            if (!validObjectId) {
                res.status(400).json({ message: "Invalid Customer ID" });
                return;
            }
            const deletedCustomer = yield customerModal_1.default.findByIdAndRemove(toBeDeletedId);
            if (!deletedCustomer) {
                res.status(404).json({ message: "Customer not found!" });
            }
            else {
                res.status(200).json({ message: "Customer Deleted Successfully!" });
            }
        }
        catch (error) {
            console.error("Error deleting customer:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
exports.deleteCustomer = deleteCustomer;
