import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Problem } from "../models/problem.model.js";
import { CodeRunner } from "../utils/CodeRunner.js";

export const runTheCode=asyncHandler(async (req, res)=>{
    const problem=req.body;
    // console.log("Problem : ", problem);
    const unhiddenTestCases=problem.test_cases.filter((test_case)=>test_case.isHidden===false);
    const allStatuses=await CodeRunner(problem.code, unhiddenTestCases, problem.language_id); 
    if(allStatuses.length==0){
      throw new ApiError(500, "Cannot process the code at the moment");
    }
    console.log(allStatuses);
    return res.status(200).json(
      new ApiResponse(
        200,
        { allStatuses },
        "Code processed successfully"
      )
    );
})

export const getProblem=asyncHandler(async (req, res)=>{
  const id = req.query.id;
  // console.log("Id in backend : ", id);
  if(!id){
    throw new ApiError(404, "Id not found");
  }
  const foundProblem=await Problem.find({id:id});
  if(!foundProblem){
    throw new ApiError(404, "Problem not found");
  }
  return res.status(200).json(new ApiResponse(
    200,
    {foundProblem},
    "Problem Found Successfully"
  ))
});
export const getAllProblems=asyncHandler(async (_, res)=>{
  const foundProblem=await Problem.find({});
  if(!foundProblem){
    throw new ApiError(404, "Problem not found");
  }
  return res.status(200).json(new ApiResponse(
    200,
    {foundProblem},
    "Problem Found Successfully"
  ))
});