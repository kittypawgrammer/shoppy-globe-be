import { Router } from "express";
import {
  addItem,
  getCart,
  removeItem,
  updateQuantity,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Every cart route requires a valid JWT; the middleware attaches req.userId.
router.use(authenticate);

router.get("/", getCart);
router.post("/", addItem);
router.put("/:productId", updateQuantity);
router.delete("/:productId", removeItem);

export default router;
