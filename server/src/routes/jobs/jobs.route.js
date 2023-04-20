const express = require('express');
const jobsRouter = express.Router();
const { isAuthenticated, isAuthorized } = require('../../middleware/auth');

jobsRouter.use(isAuthenticated)
jobsRouter.post('/jobs', isAuthorized(['admin', 'employer']), addJob);