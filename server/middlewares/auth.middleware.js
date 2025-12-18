const AppError = require("../utils/appError.js");
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.lt;

        if(!token){
            return next(new AppError('You are not logged in!', 401));
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return next(new AppError('Your token is not valid!', 401));
        };

        const user = await User.findById(decoded.id);

        if(!user){
            return next(new AppError('User does not exist', 404));
        };

        req.user = user;

        next();
    } catch (error){
        console.error("Auth Middleware Error:", error.message);

        // Handle token expiration separately
        if (error.name === "TokenExpiredError") {
            return next(new AppError("you authorization time has expired", 401));
        }

        return next(new AppError("you are not authorized!", 401));
    };
};

module.exports = protect;