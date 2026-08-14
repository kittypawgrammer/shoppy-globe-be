import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  if (!JWT_SECRET) {
    res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured",
    });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7).trim(), JWT_SECRET) as JwtPayload;
    req.userId = String(payload.userId);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
