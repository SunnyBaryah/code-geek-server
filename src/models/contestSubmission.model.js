import mongoose from "mongoose";
const contestSubmissionSchema = new mongoose.Schema(
  {
    contest_id: {
      required: true,
      type: Number,
    },
    user_id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    question_id: {
      type: Number,
      required: true,
    },
    submission_time_taken: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const ContestSubmission = mongoose.model(
  "ContestSubmission",
  contestSubmissionSchema
);
