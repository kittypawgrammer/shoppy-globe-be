import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { isValidEmail, requiredString } from "../utils/validation.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function toPublicUser(user: {
  _id: unknown;
  name: string;
  email: string;
}): { id: string; name: string; email: string } {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};

  const cleanName = requiredString(name);
  if (!cleanName) {
    throw new AppError(400, "Name is required");
  }

  const cleanEmail = requiredString(email)?.toLowerCase();
  if (!cleanEmail) {
    throw new AppError(400, "Email is required");
  }

  if (!isValidEmail(cleanEmail)) {
    throw new AppError(400, "Invalid email format");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const user = await User.create({
    name: cleanName,
    email: cleanEmail,
    password,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: toPublicUser(user),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  const cleanEmail = requiredString(email)?.toLowerCase();
  if (!cleanEmail) {
    throw new AppError(400, "Email is required");
  }

  if (typeof password !== "string" || !password) {
    throw new AppError(400, "Password is required");
  }

  const user = await User.findOne({ email: cleanEmail }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, "Invalid email or password");
  }

  res.json({
    success: true,
    message: "Login successful",
    data: { token: signToken(user._id.toString()), user: toPublicUser(user) },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json({ success: true, data: toPublicUser(user) });
});
