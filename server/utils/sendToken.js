export const sendToken = (user, statusCode, message, res)=>{
    const token = user.generateToken()
    res.status(statusCode).cookie("token", Token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    })
    .json({
        success:true,
        user,
        message,
        token,
    });
};