const express = require('express');
const jobsRouter = express.Router();
const { isAuthenticated, isAuthorized } = require('../../middleware/auth');
const { addJob } = require('./jobs.controller');

jobsRouter.use(isAuthenticated)
jobsRouter.post('/', isAuthenticated, isAuthorized(['admin', 'employer']), addJob);

module.exports = jobsRouter;