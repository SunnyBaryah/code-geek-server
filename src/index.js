import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("Database connection error:", error);
      return res.status(500).send("Internal server error");
    }
  }
  app(req, res);
}
