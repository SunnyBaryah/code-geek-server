import { Contest } from "../models/contest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// add contest
export const addContest = asyncHandler(async (req, res) => {
  const payload = req.body.data;
  if (!payload) {
    throw new ApiError(400, "Detail not given");
  }
  const contest = await Contest.create(payload);
  res
    .status(200)
    .json(new ApiResponse(`Contest created successfully`, contest));
});

// get contest
export const getContest = asyncHandler(async (req, res) => {
  const id = req.query.id;
  // console.log("Id in backend : ", id);
  if (!id) {
    throw new ApiError(404, "Id not found");
  }
  const foundContest = await Contest.find({ id: id });
  if (!foundContest) {
    throw new ApiError(404, "Contest not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { foundContest }, "Contest Found Successfully"));
});

// get all contests
export const getAllContests = asyncHandler(async (_, res) => {
  const foundContest = await Contest.find({});
  if (!foundContest) {
    throw new ApiError(404, "Contest not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { foundContest }, "Contests Found Successfully")
    );
});

//update contest
export const updateContest = asyncHandler(async (req, res) => {
  // console.log("Req body : ", req.body);
  const payload = req.body.data;
  const id = payload._id;
  const data = await Contest.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  res.status(200).json(new ApiResponse(`Updated the contest`, data));
});

// remove contest
export const deleteContest = asyncHandler(async (req, res, next) => {
  const id = req.body._id;
  await Contest.findByIdAndDelete(id)
    .then((deletedDocument) => {
      if (deletedDocument) {
        return res
          .status(201)
          .json(new ApiResponse(200, {}, "Contest Deleted Successfully!"));
      } else {
        throw new ApiError(404, "No contest found with that ID");
      }
    })
    .catch((error) => {
      next(error);
    });
});
