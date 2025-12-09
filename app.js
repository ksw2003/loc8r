require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Mongo 연결
require('./app_api/models/db');

const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const apiRouter = require('./app_api/routes/index');

const app = express();

// CORS
const cors = require('cors');
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// headers
app.use('/api', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-type, Accept, Authorization");
  next();
});

// view engine
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ⭐ Render에서 Angular build 경로 (loc8r2 추가)
app.use(express.static(path.join(__dirname, 'loc8r2', 'app_public', 'build')));

// API 라우터
app.use('/api', apiRouter);

// 유저 라우터
app.use('/users', usersRouter);

// public 폴더
app.use(express.static(path.join(__dirname, 'public')));

// ⭐ SPA 처리: Angular index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'loc8r2', 'app_public', 'build', 'index.html'));
});

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


