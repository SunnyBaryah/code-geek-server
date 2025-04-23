import { Router } from "express";
import { fetchPlagScore, fetchResponse } from "../controllers/ai.controller.js";
const router = Router();

router.route("/getResponse").post(fetchResponse);
router.route("/getPlagScore").post(fetchPlagScore);

export default router;
