const express = require('express');
const { createChat, getChats, searchUsers } = require('../controllers/chat.controller');
const protect = require('../middlewares/auth.middleware');

const chatRouter = express.Router();

chatRouter.route('/').get(protect, getChats).post(protect, createChat);
chatRouter.route('/users').get(protect, searchUsers);

module.exports = chatRouter;