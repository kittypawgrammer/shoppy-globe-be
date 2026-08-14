import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { type UserDocument } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ success: false, message: "Name is required" });
    return;
  }

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail) {
    res.status(400).json({ success: false, message: "Email is required" });
    return;
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    res.status(400).json({ success: false, message: "Invalid email format" });
    return;
  }

  if (typeof password !== "string" || password.length < 6) {
    res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    return;
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409).json({ success: false, message: "Email already registered" });
    return;
  }

  try {
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: toPublicUser(user),
    });
  } catch (error) {
    if ((error as { code?: number })?.code === 11000) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }
    throw error;
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail) {
    res.status(400).json({ success: false, message: "Email is required" });
    return;
  }

  if (typeof password !== "string" || !password) {
    res.status(400).json({ success: false, message: "Password is required" });
    return;
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: "Invalid email or password" });
    return;
  }

  res.json({
    success: true,
    message: "Login successful",
    data: { token: signToken(user._id.toString()), user: toPublicUser(user) },
  });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.json({ success: true, data: toPublicUser(user) });
}
