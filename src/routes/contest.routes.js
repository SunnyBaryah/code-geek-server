import { Router } from "express";
import {
  addContest,
  getAllContests,
  getContest,
  deleteContest,
  updateContest,
} from "../controllers/contest.controller.js";
import { verifyJWTAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/find").get(getContest);
router.route("/findAll").get(getAllContests);
router.route("/add-contest").post(verifyJWTAdmin, addContest);
router.route("/update-contest").put(verifyJWTAdmin, updateContest);
router.route("/delete-contest").delete(verifyJWTAdmin, deleteContest);

export default router;
