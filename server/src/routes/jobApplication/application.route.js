const express = require('express');
const upload = require('../../middleware/multer');
const {addApplication, } = require('./application.controller');
const { isAuthenticated, isAuthorized } = require('../../middleware/auth');
const applicationRouter = express.Router();

applicationRouter.post('/applications', isAuthenticated, isAuthorized('user'), upload.single('resume'), addApplication);
applicationRouter.get('/applications', isAuthenticated, isAuthorized('admin', 'employer'), getApplications);
applicationRouter.get('/applications/:id', isAuthenticated, isAuthorized('admin', 'employer'), getApplication);

module.exports = applicationRouter;