require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./app_api/models/db');

const usersRouter = require('./app_server/routes/users');
const apiRouter = require('./app_api/routes/index');

const app = express();

/* CORS */
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-with, Content-type, Accept, Authorization'
}));

app.options('*', (req, res) => res.sendStatus(200));

/* Middlewares */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* API Routes */
app.use('/api', apiRouter);
app.use('/users', usersRouter);

/* Angular Static Files */
const angularPath = path.join(__dirname, 'app_public', 'build');
app.use(express.static(angularPath));

/* SPA fallback */
app.get('*', (req, res) => {
  res.sendFile(path.join(angularPath, 'index.html'));
});

/* 404 처리 */
app.use((req, res, next) => {
  next(createError(404));
});

/* Error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
