/** @format */

import { Document, Model } from "mongoose";

interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

// Function to calculate skip value based on page number and items per page
const calculateSkip = (page: number, perPage: number): number => {
  return (page - 1) * perPage;
};

// Function to paginate the database query

const paginate = async <T extends Document>(
  model: Model<T>,
  query: any = {},
  page: number,
  perPage: number
): Promise<PaginationResult<T>> => {
  const skip = calculateSkip(page, perPage);

  const countQuery = model.countDocuments(query);
  const dataQuery = query.skip(skip).limit(perPage);
  const [totalItems, items] = await Promise.all([countQuery, dataQuery]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    items,
    totalItems,
    totalPages,
    currentPage: page,
    perPage,
  };
};

export { paginate };
