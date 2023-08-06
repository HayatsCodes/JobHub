const os = require('os');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const RedisStore = require("connect-redis").default
const { createClient } = require('redis');
const passport = require('passport');
const userModel = require('./models/user.model');
require('./utils/passport')(passport, userModel);
const userRouter = require('./routes/user/user.route');
const jobsRouter = require('./routes/jobs/jobs.route');
const applicationRouter = require('./routes/jobApplication/application.route');

let redisClient;

if (process.env.NODE_ENV === 'production') {
    // Create a Redis client with the production redis url
    redisClient = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
          host: process.env.REDIS_URL,
          port: process.env.REDIS_PORT
      }
  });
    
} else {
    // Create a Redis client with the default port
    redisClient = createClient();
}


redisClient.connect().catch(console.error);
const app = express();

// app.use(cors({
//   origin: '*'
// }));
app.use(helmet())
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
app.use('/api/auth', userRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api', applicationRouter);


const isWindows = os.platform() === 'win32';


if (isWindows) {
  if (process.env.NODE_ENV === 'test ') {
    // Disconnect Redis client when running in test environment
    afterAll(async () => {
      await redisClient.quit();
    }, 10000);
  }
} else {
  if (process.env.NODE_ENV === 'test') {
    // Disconnect Redis client when running in test environment
    afterAll(async () => {
      await redisClient.quit();
    }, 10000);
  } 
}



module.exports = app;