import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import userRouter from "./routes/userRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import expressFileupload from "express-fileupload";
import requestRouter from './routes/requestRouter.js';
import peripheralRoutes from "./routes/peripheralRoutes.js";

export const app = express();

config({ path: "./config/config.env" });

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Session middleware - must come after CORS and before your routes
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-here", // change in production!
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true if using https
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressFileupload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);
app.use('/api/requests', requestRouter);
app.use("/api/v1/peripherals", peripheralRoutes);

connectDB();

app.use(errorMiddleware);
