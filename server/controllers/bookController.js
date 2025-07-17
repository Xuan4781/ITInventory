import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const addBook = catchAsyncErrors(async(req, res, next)=>{})
export const deleteBook = catchAsyncErrors(async(req, res, next)=>{})
export const getAllBooks = catchAsyncErrors(async(req, res, next)=>{})