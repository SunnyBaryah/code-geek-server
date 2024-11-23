import { Router } from "express";
import { getAllSubmissions, submitCode } from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/submit").post(verifyJWT, submitCode);
router.route("/getSubmissions").get(verifyJWT, getAllSubmissions);

export default router;
