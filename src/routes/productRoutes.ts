import { Router } from "express";
import { getOne, list } from "../controllers/productController.js";

const router = Router();

router.get("/", list);
router.get("/:id", getOne);

export default router;
