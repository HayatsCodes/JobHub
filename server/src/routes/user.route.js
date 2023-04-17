const express = require('express');
const passport = require('passport');
const userRouter = express.Router();

const registerUser = require('./user.controller');

userRouter.post('/signup', registerUser);
userRouter.post('/signin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { 
        return res.status(401).json({ message: "Signin failed" }); 
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.status(200).json({ message: "Signin successful" });
      });
    });
  });
  
userRouter.post('/signout', (req, res,next) => {
    if (req.user) {
        req.logout((err) => {
            if (err) { return next(err); }
            return res.status(200).json({ message: "Signout successful" });
        });
    } else {
        return res.status(400).json({error: 'Bad request'});
    }
    
});

module.exports = userRouter;