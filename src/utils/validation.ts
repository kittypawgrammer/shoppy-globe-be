import { isValidObjectId } from "mongoose";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True when the value is a non-empty string that parses as a MongoDB ObjectId. */
export function isValidId(value: unknown): boolean {
  return typeof value === "string" && isValidObjectId(value.trim());
}

/** True when the value is an integer >= 1 (used for cart quantities). */
export function isValidQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

/** True when the value is a string that looks like an email address. */
export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

/** Trims a string and returns `null` when the value is missing or blank. */
export function requiredString(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  return value.trim();
}
