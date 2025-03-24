import { ContestSubmission } from "../models/contestSubmission.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// get all submissions related to a contest
const getAllContestSubmissions = asyncHandler(async (req, res) => {
  const contest_id = req.query.contest_id;
  if (!req.user) {
    throw new ApiError(401, "Not authorized!");
  }
  const submissions = await ContestSubmission.find({
    contest_id: contest_id,
    status: "Accepted",
  });
  // console.log("Submissions : ", submissions);
  res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "All accepted submissions fetched")
    );
});

// get all submissions related to a contest_id, user_id, and question_id
const getAllContestUserQuestionSubmissions = asyncHandler(async (req, res) => {
  const contest_id = req.query.contest_id;
  const question_id = req.query.question_id;
  if (!req.user) {
    throw new ApiError(401, "Not authorized!");
  }
  const submissions = await ContestSubmission.find({
    user_id: req.user._id,
    contest_id: contest_id,
    question_id: question_id,
  });
  // console.log("Submissions : ", submissions);
  res
    .status(200)
    .json(new ApiResponse(200, submissions, "All submissions fetched"));
});

// post a submission related to a contest_id, user_id, and question_id
const submitCode = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized!");
  }
  const payload = req.body;
  console.log("Payload : ", payload);
  if (payload.code.length === 0) {
    throw new ApiError(400, "There is no code to submit");
  }
  const newSubmission = new ContestSubmission({
    contest_id: payload.contest_id,
    user_id: req.user._id,
    username: req.user.username,
    code: payload.code,
    status: payload.status,
    question_id: payload.question_id,
    submission_time_taken: payload.submission_time_taken,
  });
  await newSubmission.save();
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Submission saved successfully"));
});

export {
  getAllContestSubmissions,
  getAllContestUserQuestionSubmissions,
  submitCode,
};
