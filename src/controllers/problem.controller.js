import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Problem } from "../models/problem.model.js";
import { CodeRunner } from "../utils/CodeRunner.js";

export const runTheCode = asyncHandler(async (req, res) => {
  const problem = req.body;
  // console.log("Problem : ", problem);
  const unhiddenTestCases = problem.test_cases.filter(
    (test_case) => test_case.isHidden === false
  );
  const allStatuses = await CodeRunner(
    problem.code,
    unhiddenTestCases,
    problem.language_id
  );
  if (allStatuses.length == 0) {
    throw new ApiError(500, "Cannot process the code at the moment");
  }
  console.log(allStatuses);
  return res
    .status(200)
    .json(new ApiResponse(200, { allStatuses }, "Code processed successfully"));
});

export const getProblem = asyncHandler(async (req, res) => {
  const id = req.query.id;
  // console.log("Id in backend : ", id);
  if (!id) {
    throw new ApiError(404, "Id not found");
  }
  const foundProblem = await Problem.find({ id: id });
  if (!foundProblem) {
    throw new ApiError(404, "Problem not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { foundProblem }, "Problem Found Successfully"));
});

export const addProblem = asyncHandler(async (req, res) => {
  const payload = req.body.data;
  if (!payload) {
    throw new ApiError(400, "Detail not given");
  }
  const problem = await Problem.create(payload);
  res
    .status(200)
    .json(new ApiResponse(`Problem created successfully`, problem));
});

export const updateProblem = asyncHandler(async (req, res) => {
  // console.log("Req body : ", req.body);
  const payload = req.body.data;
  const id = payload._id;
  const data = await Problem.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  res.status(200).json(new ApiResponse(`Updated the problem`, data));
});

export const deleteProblem = asyncHandler(async (req, res, next) => {
  const id = req.body._id;
  await Problem.findByIdAndDelete(id)
    .then((deletedDocument) => {
      if (deletedDocument) {
        // console.log("Document deleted:", deletedDocument);
        return res
          .status(201)
          .json(new ApiResponse(200, {}, "Problem Deleted Successfully!"));
      } else {
        // console.log("No document found with that ID");
        throw new ApiError(404, "No problem found with that ID");
      }
    })
    .catch((error) => {
      next(error);
    });
});

export const getAllProblems = asyncHandler(async (_, res) => {
  const foundProblem = await Problem.find({});
  if (!foundProblem) {
    throw new ApiError(404, "Problem not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { foundProblem }, "Problem Found Successfully"));
});
