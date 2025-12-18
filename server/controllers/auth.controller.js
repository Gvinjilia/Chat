const User = require("../models/user.model");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");

const createSendToken = (user, statusCode, res) => {
    const token = user.signToken();

    const cookieSettings = {
        httpOnly: true, 
        secure: false,
        sameSite: 'Lax',
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 
    };

    res.cookie('lt', token, cookieSettings);
    res.status(statusCode).json(user);
};

const signup = catchAsync(async (req, res, next) => {
    const { fullname, email, password} = req.body;

    const user = await User.findOne({ email });

    if(user){
        return next(new AppError('Email already registered', 400));
    };

    const newUser = await User.create({
        fullname, 
        email, 
        password
    });

    res.status(201).json(user);
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new AppError('email or password is incorrect', 404));
    };

    const correct = await user.comparePasswords(password, user.password);

    if(!correct){
        return next(new AppError('email or password is incorrect', 404));
    };

    user.password = undefined;

    createSendToken(user, 201, res);
});

module.exports = { signup, login };