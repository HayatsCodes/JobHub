const express = require('express');
const passport = require('passport');
const userRouter = express.Router();

const registerUser = require('./user.controller');

userRouter.post('/auth/signup', registerUser);
userRouter.post('/auth/signin')
userRouter.post('/auth/signout')