const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");

const getChats = catchAsync(async (req, res, next) => {
    const chats = await Chat.find({ members: req.user._id }).populate('members', 'username');

    res.status(200).json(chats);
});

const createChat = catchAsync(async (req, res, next) => {
    const { title, members } = req.body;

    const newChat = await Chat.create({
        title, 
        createdBy: req.user._id,
        members: [...members, req.user._id]
    });

    res.status(201).json(newChat);
});

const searchUsers = catchAsync(async (req, res, next) => {
    const { query } = req.query;

    const users = await User.find({
        fullname: { $regex: query, $options: "i" },
        _id: { $ne: req.user._id }
    });

    res.status(200).json(users);
});

module.exports = { createChat, searchUsers, getChats };