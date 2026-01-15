import express from "express";
import connectDB from "./config/db.config";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import bidRouter from "./routes/bid.routes";
import gigRouter from "./routes/gig.routes";
import http from "http";
import { initServer } from "./socket";

dotenv.config();

const app = express();
const server = http.createServer(app);

initServer(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV || "dev"));

app.use("/api/auth", authRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/bids", bidRouter);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database connection established...");

    server.listen(port, () => {
      console.log(`Server running on PORT ${port} 🚀`);
    });
  })
  .catch(() => {
    console.error("Database cannot be connected ❌");
  });
