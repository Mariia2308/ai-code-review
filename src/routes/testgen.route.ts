import { Router } from "express";
import { testgenSchema } from "../schemas/testgen.schema.js";
import { generateTests } from "../services/testgen.service.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = testgenSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      });
    }

    const result = await generateTests(
      parsed.data.code,
      parsed.data.language
    );

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;