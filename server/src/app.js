const express = require('express');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const userModel = require('./models/user.model');
require('./utils/passport')(passport, userModel);

const redisClient = redis.createClient();
const app = express();


app.use(session({
    store: new redisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
  
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));

module.exports = app;