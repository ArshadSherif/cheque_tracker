import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chequeRoutes from "./routes/chequeRoutes.js";
import { connectToDb } from "./config/datbase.js";

import "./cron/chequeRemined.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/cheques", chequeRoutes);

app.get("/", (req, res) => {
  connectToDb();
  res.send("Cheque Management API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
