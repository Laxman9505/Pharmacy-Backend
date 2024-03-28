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
exports.saveStoreDetail = exports.getStoreDetail = void 0;
const storeModal_1 = __importDefault(require("../modal/storeModal"));
function getStoreDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const storeDetail = yield storeModal_1.default.findOne();
            if (storeDetail) {
                res.status(200).json(storeDetail);
            }
            else {
                res.status(404).json({ message: "Store details not found" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        }
    });
}
exports.getStoreDetail = getStoreDetail;
function saveStoreDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, location, phoneNumber, email, currencySymbol } = req.body;
            const storeDetail = {
                storeDetails: { name, location, phoneNumber, email, currencySymbol },
                receiptConfiguration: req.body.receiptConfiguration,
                printerConfiguration: req.body.printerConfiguration,
            };
            const existingStoreDetail = yield storeModal_1.default.findOne();
            if (existingStoreDetail) {
                existingStoreDetail.storeDetails = storeDetail.storeDetails;
                existingStoreDetail.receiptConfiguration =
                    storeDetail.receiptConfiguration;
                existingStoreDetail.printerConfiguration =
                    storeDetail.printerConfiguration;
                yield existingStoreDetail.save();
                res.status(200).json({ message: "Store details updated successfully" });
            }
            else {
                const newStoreDetail = new storeModal_1.default(storeDetail);
                yield newStoreDetail.save();
                res.status(201).json({ message: "Store details saved successfully" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        }
    });
}
exports.saveStoreDetail = saveStoreDetail;
