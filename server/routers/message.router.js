const express = require('express');
const { getMessages, sendMessage } = require('../controllers/message.controller');
const protect = require('../middlewares/auth.middleware');

const messageRouter = express.Router();

messageRouter.route('/').post(protect, sendMessage)
messageRouter.get('/:chatId', protect, getMessages);

module.exports = messageRouter;