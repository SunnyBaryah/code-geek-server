import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating tokens",
      error
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully!"));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.body._id;
  await User.findByIdAndDelete(id)
    .then((deletedDocument) => {
      if (deletedDocument) {
        // console.log("Document deleted:", deletedDocument);
        return res
          .status(201)
          .json(new ApiResponse(200, {}, "User Deleted Successfully!"));
      } else {
        // console.log("No document found with that ID");
        throw new ApiError(404, "No user found with that ID");
      }
    })
    .catch((error) => {
      next(error);
    });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const foundUser = await User.findOne({ $or: [{ email }] });
  if (!foundUser) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordCorrect = await foundUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }
  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(
    foundUser._id
  );
  const loggedInUser = await User.findById(foundUser._id).select(
    "-password -refreshToken"
  );
  // Cookie generation
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In successfully"
      )
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const foundUser = await User.findOne({ $or: [{ email }] });
  if (!foundUser) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordCorrect = await foundUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }
  if (foundUser.isAdmin !== true) {
    throw new ApiError(401, "Id does not have Admin rights");
  }
  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(
    foundUser._id
  );
  const loggedInUser = await User.findById(foundUser._id).select(
    "-password -refreshToken"
  );
  // Cookie generation
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Admin Logged In successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } = await generateAcessAndRefreshToken(
      user._id
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid request token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldpass, newpass } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldpass);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }
  user.password = newpass;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched Successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: { username, email },
    },
    { new: true }
  ).select("-password");
  // new:true karne se user after updation milega
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const data = await User.find({});
  if (!data) {
    throw new ApiError(404, "Users not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { data }, "Users Found Successfully"));
});

const updateAccountStatus = asyncHandler(async (req, res) => {
  const payload = req.body.data;
  const id = payload._id;
  const data = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  res.status(200).json(new ApiResponse(`Updated the user details`, data));
});

const addSolvedProblem = asyncHandler(async (req, res) => {
  const { problem_id, difficulty, problem_title } = req.body;
  // console.log("Id : ", problem_id, " Diff : ",  difficulty)
  if (!problem_id || !difficulty || !problem_title) {
    throw new ApiError(400, "All three fields about problem are required");
  }
  // $push pushes an element into the array
  // $ne means not equal to
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      "solved_questions.problem_id": { $ne: problem_id }, // Check if problem_id does not exist
    },
    {
      $addToSet: {
        solved_questions: { problem_id, difficulty, problem_title },
      }, // Add if not already in the array
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Solved Problems updated successfully"));
});

const getSolvedProblems = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.solved_questions,
        "Solved Questions fetched successfully"
      )
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  addSolvedProblem,
  getSolvedProblems,
  loginAdmin,
  updateAccountStatus,
  getAllUsers,
  deleteUser,
};
