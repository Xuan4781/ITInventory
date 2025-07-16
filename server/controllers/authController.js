import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../middlewares/errorMiddlewares";
import { User } from "../models/userModel";
import bcyrpt from "bcrypt";
import crypto from "crypto";

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password} = req.body;
        if(!name || !email ||!password){
            return next(new ErrorHandler("Please enter all fields", 400));
        }
        const isRegistered = await User.findOne({email, accountVerified: true});
        if(isRegistered){
            return next(new ErrorHandler("User already exists", 400));
        }
        const registrationAttemptsByUser = await User.find({
            email,
            accountVerified: false,   
        });
        if(registrationAttemptsByUser.length >=5){
            return next(new ErrorHandler(
                "You have exceeded the number of registration attempts. Please contact support.",
                400
            ));
        }
        if(passowrd.length < 8 || password.length > 16){
            return next(new ErrorHandler("Passowrd must be between 8 and 16 characters.", 400));
        }
        const hashedPassword = await bcyrpt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode, email, res);
    } catch (error) {
        next(error);

    }
});