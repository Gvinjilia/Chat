const express = require('express');
const { signup, login } = require('../controllers/auth.controller');
const protect = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

module.exports = authRouter;