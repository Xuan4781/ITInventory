import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase:true,
    },
    password: {
        type:String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    },
    accountVerified: {type: Boolean, default: false},
    borrowedBooks: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Borrow"
        },
        returned: {
            type: Boolean,
            default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
    },],
    avatar: {
        public_id: String,
        url: String, 
    },
    verificationCode: Number,
    verificationCodeExpired: Date,
    resetPasswordToken: String,
    resetPasswordExpired: Date,
},
{
    timestamps: true,
}
);
userSchema.methods.generateVerificationCode = function(){
    function generateRandomFiveDigitNumber(){
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, 0);
        return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpired = Date.now() + 15 * 60 * 1000;
    return verificationCode;
}

userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,

    })
};
export const User = mongoose.model("User", userSchema)