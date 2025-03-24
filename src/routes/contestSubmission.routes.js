import { Router } from "express";
import {
  getAllContestSubmissions,
  getAllContestUserQuestionSubmissions,
  submitCode,
} from "../controllers/contestSubmission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/submit").post(verifyJWT, submitCode);
router.route("/getAllSubmissions").get(verifyJWT, getAllContestSubmissions);
router
  .route("/getAllQuestionSubmissions")
  .get(verifyJWT, getAllContestUserQuestionSubmissions);

export default router;
