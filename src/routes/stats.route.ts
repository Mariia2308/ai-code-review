import { Router } from "express";
import { getStats } from "../services/stats.service.js";

const router = Router();

router.get("/", (_req, res) => {
  const stats = getStats();
  res.json(stats);
});

export default router;