import { isValidObjectId } from "mongoose";
import type { Request, Response } from "express";
import Product from "../models/Product.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function list(req: Request, res: Response) {
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
}

export async function getOne(req: Request, res: Response) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid product id format" });
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }

  res.json({ success: true, data: product });
}
