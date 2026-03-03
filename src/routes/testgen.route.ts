import { Router } from "express";
import { testgenSchema } from "../schemas/testgen.schema.js";
import { generateTests } from "../services/testgen.service.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { code, language } = testgenSchema.parse(req.body);

    const result = await generateTests(code, language);

    res.json(result);

  } catch (error) {
    next(error);
  }
});

export default router;