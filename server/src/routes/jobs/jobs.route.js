const express = require('express');

const jobsRouter = express.Router();

jobsRouter.post('/jobs', isAuthenticated, isAuthorized(['admin', 'employer']), addJob);