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

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://gig-flow-lemon.vercel.app",
  "http://localhost:5173",
  process.env.FRONTEND_URL!,
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(express.json());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV || "dev"));

app.use("/api/auth", authRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/bids", bidRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running 🚀" });
});

const port = process.env.PORT;

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
