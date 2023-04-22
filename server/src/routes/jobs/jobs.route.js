const express = require('express');
const jobsRouter = express.Router();
const { isAuthenticated, isAuthorized } = require('../../middleware/auth');
const { 
    addJob,
    getEmployerJobs,
    getEmployerJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob,
} = require('./jobs.controller');

jobsRouter.use(isAuthenticated)
jobsRouter.post('/', isAuthorized(['admin', 'employer']), addJob);
jobsRouter.get('/employer', isAuthorized(['admin', 'employer']), getEmployerJobs);
jobsRouter.get('/employer/:id', isAuthorized(['admin', 'employer']), getEmployerJob);
jobsRouter.get('/', isAuthorized(['admin', 'user']), getJobs);
jobsRouter.get('/:id', isAuthorized(['admin', 'user']), getJob);
jobsRouter.patch('/employer/:id', isAuthorized(['admin', 'employer']), updateJob);
jobsRouter.delete('/employer/:id', isAuthorized(['admin', 'employer']), deleteJob);

module.exports = jobsRouter;