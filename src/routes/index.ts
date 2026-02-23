import { Router } from "express";
import reviewRoute from "./review.route.js";
import testgenRoute from "./testgen.route.js";
import riskRoute from "./risk.route.js";
import statsRoute from "./stats.route.js";
const router = Router();

router.use("/review", reviewRoute);
router.use("/generate-tests", testgenRoute);
router.use("/risk", riskRoute);
router.use("/stats", statsRoute);
export default router;