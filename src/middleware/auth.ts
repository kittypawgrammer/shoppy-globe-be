import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "No token provided"));
    return;
  }

  if (!JWT_SECRET) {
    next(new AppError(500, "JWT_SECRET is not configured"));
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7).trim(), JWT_SECRET) as JwtPayload;
    req.userId = String(payload.userId);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
