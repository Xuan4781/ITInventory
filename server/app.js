import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";

export const app = express();

config({path: "./config/config.env"});

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,

}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

app.use(errorMiddleware);