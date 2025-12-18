const Message = require("../models/message.model");
const catchAsync = require("../utils/catchAsync");

const getMessages = catchAsync(async (req, res) => {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId }).populate('sender');

    res.status(200).json(messages);
});

const sendMessage = catchAsync(async (req, res, next) => {
    const { chatId, message } = req.body;

    const newMessage = await Message.create({
        chatId,
        sender: req.user._id,
        message
    });

    const populated = await newMessage.populate('sender', 'fullname');

    req.io.to(chatId).emit('message', populated);

    res.status(201).json(populated);
});

module.exports = { sendMessage, getMessages };