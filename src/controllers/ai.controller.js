import { generateContent } from "../utils/aiService.js";
import { generatePlagScore } from "../utils/plagCheckService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function fetchResponse(req, res) {
  // console.log(req.body);
  const prompt = req.body.prompt;
  if (!prompt) {
    throw new ApiError(400, "Prompt is required");
  }
  const response = await generateContent(prompt);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { response }, "Response generated successfully")
    );
}

export async function fetchPlagScore(req, res) {
  // console.log(req.body);
  const prompt = req.body.prompt;
  if (!prompt) {
    throw new ApiError(400, "Prompt is required");
  }
  const response = await generatePlagScore(prompt);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { response }, "Plag Score generated successfully")
    );
}
