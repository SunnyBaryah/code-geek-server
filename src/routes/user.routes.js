import { Router } from 'express';
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
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-access-token").post(refreshAccessToken);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/get-solved-questions").get(verifyJWT, getSolvedProblems);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-account-details").post(verifyJWT, updateAccountDetails);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/add-solved").put(verifyJWT, addSolvedProblem);

export default router;