import type { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import AppError from "../utils/AppError.js";

interface DuplicateKeyError {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isDuplicateKeyError(error: unknown): error is DuplicateKeyError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === 11000
  );
}

/**
 * Global error-handling middleware. Maps known error types (`AppError`,
 * Mongoose cast/validation errors, duplicate-key violations) to consistent
 * `{ success: false, message }` JSON responses; anything else becomes a 500
 * and is logged to the console.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal server error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof MongooseError.CastError) {
    statusCode = 400;
    message = "Invalid id format";
  } else if (error instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message =
      Object.values(error.errors)[0]?.message ?? "Invalid input data";
  } else if (isDuplicateKeyError(error)) {
    statusCode = 409;
    const field = Object.keys(error.keyValue ?? {})[0];
    message =
      field === "email"
        ? "Email already registered"
        : `Duplicate value for ${field ?? "field"}`;
  }

  if (!res.headersSent) {
    res.status(statusCode).json({ success: false, message });
  }

  if (statusCode >= 500) {
    console.error(error);
  }
}
