const express = require('express');
const userController = require('../controller/userController');
const isAuth = require('../middleware/isAuth');

const userRouter = express.Router();

userRouter.get('/current', isAuth, userController.getCurrentUser);

module.exports = userRouter;
