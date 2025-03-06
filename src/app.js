import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import {
  problemRouter,
  userRouter,
  submissionRouter,
  aiRouter,
} from "./routes/index.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problem", problemRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/ai", aiRouter);

export { app };
