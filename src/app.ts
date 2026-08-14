import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

export default app;
