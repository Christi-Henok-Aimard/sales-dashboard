import { Router } from "express";
import { getSalesData } from "../data/sales.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getSalesData());
});

export default router;