import { isValidObjectId } from "mongoose";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidId(value: unknown): boolean {
  return typeof value === "string" && isValidObjectId(value.trim());
}

export function isValidQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

export function requiredString(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  return value.trim();
}
