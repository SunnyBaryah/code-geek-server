import { Submission } from "./../models/submission.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const submitCode = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized!");
  }
  const payload = req.body;
  // console.log(payload);
  if (payload.code.length === 0) {
    throw new ApiError(400, "There is no code to submit");
  }
  const newSubmission = new Submission({
    user_id: req.user._id,
    problem_id: payload.problem_id,
    code: payload.code,
    status: payload.status,
  });
  await newSubmission.save();
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Submission saved successfully"));
});

const getAllSubmissions = asyncHandler(async (req, res) => {
  const prob_id = req.query.id;
  if (!req.user) {
    throw new ApiError(401, "Not authorized!");
  }
  const submissions = await Submission.find({
    user_id: req.user._id,
    problem_id: prob_id,
  });
  // console.log("Submissions : ", submissions);
  res
    .status(200)
    .json(new ApiResponse(200, submissions, "All submissions fetched"));
});

export { submitCode, getAllSubmissions };
