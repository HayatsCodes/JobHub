const express = require('express');
const jobsRouter = express.Router();
const { isAuthenticated, isAuthorized } = require('../../middleware/auth');
const { addJob, getJobs, getJob } = require('./jobs.controller');

jobsRouter.use(isAuthenticated)
jobsRouter.post('/', isAuthenticated, isAuthorized(['admin', 'employer']), addJob);
jobsRouter.get('/', isAuthenticated, isAuthorized(['admin', 'user']), getJobs);
jobsRouter.get('/:id', isAuthenticated, isAuthorized(['admin', 'user']), getJob);

module.exports = jobsRouter;