import { Router } from "express";
import { calculateRisk } from "../services/risk.service.js";
import { riskSchema } from "../schemas/risk.schema.js";

const router = Router();

router.post("/", (req, res, next) => {
  try {
    const { code } = riskSchema.parse(req.body);

    const result = calculateRisk(code);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;