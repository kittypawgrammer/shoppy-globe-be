/**
 * Operational error carrying an HTTP status code. Thrown by controllers and
 * middleware; the global error handler translates it into a JSON response.
 */
export default class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
