import { isValidObjectId } from "mongoose";
import type { Request, Response } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

function parseQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return null;
  }
  return value;
}

export async function addItem(req: Request, res: Response) {
  const userId = req.userId as string;
  const { productId, quantity } = req.body ?? {};

  if (typeof productId !== "string" || !productId.trim()) {
    res.status(400).json({ success: false, message: "Product id is required" });
    return;
  }

  if (!isValidObjectId(productId)) {
    res.status(400).json({ success: false, message: "Invalid product id format" });
    return;
  }

  const validQuantity = parseQuantity(quantity);
  if (validQuantity === null) {
    res.status(400).json({
      success: false,
      message: "Quantity must be an integer greater than or equal to 1",
    });
    return;
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }

  if (product.stock < 1) {
    res.status(400).json({ success: false, message: "Product is out of stock" });
    return;
  }

  let cart = await Cart.findByUser(userId);

  if (!cart) {
    cart = new Cart({ userId });
  }

  await cart.addItem(productId, validQuantity);

  res.json({ success: true, message: "Product added to cart", data: cart });
}

export async function updateQuantity(req: Request, res: Response) {
  const userId = req.userId as string;
  const productId = req.params.productId as string;
  const { quantity } = req.body ?? {};

  if (!isValidObjectId(productId)) {
    res.status(400).json({ success: false, message: "Invalid product id format" });
    return;
  }

  const validQuantity = parseQuantity(quantity);
  if (validQuantity === null) {
    res.status(400).json({
      success: false,
      message: "Quantity must be an integer greater than or equal to 1",
    });
    return;
  }

  const cart = await Cart.findByUser(userId);

  if (!cart) {
    res.status(404).json({ success: false, message: "Item not in cart" });
    return;
  }

  const item = cart.items.find((item) => item.productId.toString() === productId);

  if (!item) {
    res.status(404).json({ success: false, message: "Item not in cart" });
    return;
  }

  await cart.updateItemQuantity(productId, validQuantity);

  res.json({ success: true, message: "Cart updated", data: cart });
}

export async function removeItem(req: Request, res: Response) {
  const userId = req.userId as string;
  const productId = req.params.productId as string;

  if (!isValidObjectId(productId)) {
    res.status(400).json({ success: false, message: "Invalid product id format" });
    return;
  }

  const cart = await Cart.findByUser(userId);

  if (!cart) {
    res.status(404).json({ success: false, message: "Item not in cart" });
    return;
  }

  const item = cart.items.find((item) => item.productId.toString() === productId);

  if (!item) {
    res.status(404).json({ success: false, message: "Item not in cart" });
    return;
  }

  await cart.removeItem(productId);

  res.json({ success: true, message: "Product removed from cart" });
}

export async function getCart(req: Request, res: Response) {
  const userId = req.userId as string;

  const cart = await Cart.findByUser(userId);

  if (!cart) {
    res.status(404).json({ success: false, message: "No cart exists yet" });
    return;
  }

  res.json({ success: true, data: cart });
}
