import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  addSolvedProblem,
  getSolvedProblems,
  updateAccountStatus,
  getAllUsers,
  deleteUser,
  loginAdmin,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyJWTAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-access-token").post(refreshAccessToken);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/get-solved-questions").get(verifyJWT, getSolvedProblems);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-account-details").post(verifyJWT, updateAccountDetails);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/add-solved").put(verifyJWT, addSolvedProblem);

// admin routes
router.route("/admin-login").post(loginAdmin);
router.route("/get-current-admin").get(verifyJWTAdmin, getCurrentUser);
router.route("/get-all-users").get(verifyJWTAdmin, getAllUsers);
router.route("/update-account-status").put(verifyJWTAdmin, updateAccountStatus);
router.route("/delete-user").delete(verifyJWTAdmin, deleteUser);

export default router;
