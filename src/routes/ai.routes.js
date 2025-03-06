import { Router } from "express";
import { fetchResponse } from "../controllers/ai.controller.js";
const router = Router();

router.route("/getResponse").post(fetchResponse);

export default router;
