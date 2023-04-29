const express = require('express');
const upload = require('../../middleware/multer');
const {addApplication, getApplications, getApplication} = require('./application.controller');
const { isAuthenticated, isAuthorized } = require('../../middleware/auth');
const applicationRouter = express.Router();

applicationRouter.use(isAuthenticated);

applicationRouter.post('/applications', isAuthorized(['user']), upload.single('resume'), addApplication);
applicationRouter.get('/applications', isAuthorized(['admin', 'employer']), getApplications);
applicationRouter.get('/applications/:id', isAuthenticated, isAuthorized(['admin', 'employer']), getApplication);

module.exports = applicationRouter;