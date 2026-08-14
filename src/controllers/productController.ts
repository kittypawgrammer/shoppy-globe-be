import type { Request, Response } from "express";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { isValidId } from "../utils/validation.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const list = asyncHandler(async (req: Request, res: Response) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  let limit = Number(req.query.limit);
  if (!Number.isInteger(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }
  limit = Math.min(limit, MAX_LIMIT);

  const query = search
    ? { name: { $regex: escapeRegex(search), $options: "i" } }
    : {};

  const products = await Product.find(query).limit(limit);

  res.json({ success: true, count: products.length, data: products });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    throw new AppError(400, "Invalid product id format");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  res.json({ success: true, data: product });
});
