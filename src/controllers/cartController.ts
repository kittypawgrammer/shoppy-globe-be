import type { Request, Response } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { isValidId, isValidQuantity } from "../utils/validation.js";

/** POST /cart — adds a product to the current user's cart. */
export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const { productId, quantity } = req.body ?? {};

  if (typeof productId !== "string" || !productId.trim()) {
    throw new AppError(400, "Product id is required");
  }

  if (!isValidId(productId)) {
    throw new AppError(400, "Invalid product id format");
  }

  if (!isValidQuantity(quantity)) {
    throw new AppError(
      400,
      "Quantity must be an integer greater than or equal to 1"
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (product.stock < 1) {
    throw new AppError(400, "Product is out of stock");
  }

  let cart = await Cart.findByUser(userId);

  if (!cart) {
    cart = new Cart({ userId });
  }

  await cart.addItem(productId, quantity);

  res.json({ success: true, message: "Product added to cart", data: cart });
});

/** PUT /cart/:productId — sets the quantity of an existing cart item. */
export const updateQuantity = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const productId = req.params.productId as string;
    const { quantity } = req.body ?? {};

    if (!isValidId(productId)) {
      throw new AppError(400, "Invalid product id format");
    }

    if (!isValidQuantity(quantity)) {
      throw new AppError(
        400,
        "Quantity must be an integer greater than or equal to 1"
      );
    }

    const cart = await Cart.findByUser(userId);

    if (!cart) {
      throw new AppError(404, "Item not in cart");
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      throw new AppError(404, "Item not in cart");
    }

    await cart.updateItemQuantity(productId, quantity);

    res.json({ success: true, message: "Cart updated", data: cart });
  }
);

/** DELETE /cart/:productId — removes a product from the current user's cart. */
export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const productId = req.params.productId as string;

  if (!isValidId(productId)) {
    throw new AppError(400, "Invalid product id format");
  }

  const cart = await Cart.findByUser(userId);

  if (!cart) {
    throw new AppError(404, "Item not in cart");
  }

  const item = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!item) {
    throw new AppError(404, "Item not in cart");
  }

  await cart.removeItem(productId);

  res.json({ success: true, message: "Product removed from cart" });
});

/** GET /cart — returns the current user's cart (404 if none exists yet). */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId as string;

  const cart = await Cart.findByUser(userId);

  if (!cart) {
    throw new AppError(404, "No cart exists yet");
  }

  res.json({ success: true, data: cart });
});
