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

const cors = require('cors');
app.use(cors());

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ---------- API 라우트는 먼저 등록 ----------
app.use('/api', apiRouter);
app.use('/users', usersRouter);

// ---------- 프론트 정적 파일 ----------
app.use(express.static(path.join(__dirname, 'app_public', 'build')));

// ---------- SPA fallback은 정적 파일 뒤 ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

// ---------- 에러 핸들러 ----------
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;

