const express = require('express');
const passport = require('passport');
const userRouter = express.Router();

const registerUser = require('./user.controller');

userRouter.post('/auth/signup', registerUser);
userRouter.post('/auth/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
userRouter.post('/auth/signout', (req, res,next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
})