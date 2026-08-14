import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { swaggerDocument, swaggerUi } from "./swagger.js";
import AppError from "./utils/AppError.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

export default app;
