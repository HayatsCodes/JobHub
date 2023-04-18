const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const RedisStore = require("connect-redis").default
const { createClient } = require('redis');
const passport = require('passport');
const userRouter = require('./routes/user/user.route');
const userModel = require('./models/user.model');
require('./utils/passport')(passport, userModel);

const redisClient = createClient();
redisClient.connect().catch(console.error);
const app = express();

app.use(express.json());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));
app.use('/auth', userRouter);
if (process.env.NODE_ENV === 'test ') {
  // Disconnect Redis client when running in test environment
  afterAll(async () => {
    await redisClient.quit();
  }, 10000);
}

module.exports = app;