import { Router } from "express";
import { calculateRisk } from "../services/risk.service.js";

const router = Router();

router.post("/", (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const result = calculateRisk(code);
    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;