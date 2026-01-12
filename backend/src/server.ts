import express from "express";
import connectDB from "./config/db.config";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import bidRouter from "./routes/bid.routes";
import gigRouter from "./routes/gig.routes";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(morgan(`${process.env.NODE_ENV}`));

app.use("/api/auth", authRouter);
app.use("/api/gigs", bidRouter);
app.use("/api/bids", gigRouter);

const port = process.env.PORT || 5000;
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(port, () => {
      console.log("Server is successfully listening on PORT " + port + "✅✅✅");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected❌ ❌ ❌");
  });
