import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // console.log("reqCookies: ", req.header);
    if (!req.cookies?.accessToken && !req.header("Authorization")) {
      throw new ApiError(401, "Unauthorized Access");
    }
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    // console.log("Token, ", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized Access");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const verifyJWTAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (!req.cookies?.accessToken && !req.header("Authorization")) {
      throw new ApiError(401, "Unauthorized Access");
    }
    // console.log("reqCookies: ", req.header);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    // console.log("Token, ", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized Access");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    if (user.isAdmin !== true) {
      throw new ApiError(401, "Admin privileges not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
