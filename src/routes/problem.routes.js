import { Router } from "express";
import {
  addProblem,
  deleteProblem,
  getAllProblems,
  getProblem,
  runTheCode,
  updateProblem,
} from "../controllers/problem.controller.js";
import { verifyJWTAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/run").post(runTheCode);
router.route("/find").get(getProblem);
router.route("/findAll").get(getAllProblems);
router.route("/add-problem").post(verifyJWTAdmin, addProblem);
router.route("/update-problem").put(verifyJWTAdmin, updateProblem);
router.route("/delete-problem").delete(verifyJWTAdmin, deleteProblem);

export default router;
