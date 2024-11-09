import { Router } from "express";
import { getAllProblems, getProblem, runTheCode } from "../controllers/problem.controller.js";
const router=Router();

router.route("/run").post(runTheCode);
router.route("/find").get(getProblem);
router.route("/findAll").get(getAllProblems);
export default router;