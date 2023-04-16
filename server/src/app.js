const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('combined'));

module.exports = app;