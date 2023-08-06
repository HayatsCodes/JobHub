const express = require('express');
const passport = require('passport');
const userRouter = express.Router();
 const { isAuthenticated } = require('../../middleware/auth');

const {registerUser, loginUser} = require('./user.controller');

userRouter.post('/signup', registerUser);
userRouter.post('/signin', loginUser);

  
userRouter.post('/signout', isAuthenticated, (req, res, next) => {
        req.logout((err) => {
            if (err) { return next(err); }
            return res.status(200).json({ message: "Signout successful" });
        });
    }
);

module.exports = userRouter;