'use strict';

const path = require('path');
const express = require('express');
const createError = require('http-errors');
const cors = require('cors');
const expressSession = require('express-session');
const logger = require('morgan');
const serveFavicon = require('serve-favicon');
const basicAuthenticationDeserializer = require('./middleware/basic-authentication-deserializer.js');
const bindUserToViewLocals = require('./middleware/bind-user-to-view-locals.js');
const corsOptions = require('./config/cors');
const expressSessionOptions = require('./config/expressSession');

const baseRouter = require('./routes/base');
const authenticationRouter = require('./routes/authentication');
const profileRouter = require('./routes/profile');
const roomRouter = require('./routes/room');
const themeRouter = require('./routes/theme');

const app = express();

app.use(serveFavicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(expressSession(expressSessionOptions));
app.use(basicAuthenticationDeserializer);
app.use(bindUserToViewLocals);

app.use('/', baseRouter);
app.use('/authentication', authenticationRouter);
app.use('/profile', profileRouter);
app.use('/room', roomRouter);
app.use('/theme', themeRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ type: 'error', error: { message: error.message } });
});

module.exports = app;
