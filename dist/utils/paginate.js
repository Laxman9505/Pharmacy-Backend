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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
// Function to calculate skip value based on page number and items per page
const calculateSkip = (page, perPage) => {
    return (page - 1) * perPage;
};
// Function to paginate the database query
const paginate = (model, query = {}, page, perPage, searchKeyword) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = searchKeyword ? 0 : calculateSkip(page, perPage);
    const countQuery = model.countDocuments(query);
    const dataQuery = query.skip(skip).limit(perPage);
    const [totalItems, items] = yield Promise.all([countQuery, dataQuery]);
    const totalPages = Math.ceil(totalItems / perPage);
    return {
        items,
        totalItems,
        totalPages,
        currentPage: page,
        perPage,
    };
});
exports.paginate = paginate;
