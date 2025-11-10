import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import solveRoutes from "./routes/solves.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/solves", solveRoutes);

app.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);
