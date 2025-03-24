import mongoose from "mongoose";
const contestSchema = new mongoose.Schema(
  {
    id: {
      required: true,
      type: Number,
    },
    start_time: {
      required: true,
      type: Date,
    },
    end_time: {
      required: true,
      type: Date,
    },
    question_ids: [
      {
        type: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Contest = mongoose.model("Contest", contestSchema);
