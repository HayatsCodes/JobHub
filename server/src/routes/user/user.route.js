const express = require('express');
const passport = require('passport');
const userRouter = express.Router();
 const { isAuthenticated } = require('../../middleware/auth');

const registerUser = require('./user.controller');

userRouter.post('/signup', registerUser);
userRouter.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      console.error(err);
      return res.status(500).json({ error: "An error occurred during authentication" });
    }
    if (!user) { 
      return res.status(401).json(info);
    }
    req.logIn(user, (err) => {
      if (err) { 
        console.error(err);
        return res.status(500).json({ message: "An error occurred while logging in" });
      }
      return res.status(200).json({ message: "Signin successful" });
    });
  })(req, res, next);
});

  
userRouter.post('/signout', isAuthenticated, (req, res, next) => {
        req.logout((err) => {
            if (err) { return next(err); }
            return res.status(200).json({ message: "Signout successful" });
        });
    }
);

module.exports = userRouter;