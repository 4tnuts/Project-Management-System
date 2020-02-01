const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({
  user : 'postgres',
  host : 'localhost',
  database : 'pms',
  password : 'lala123',
  port : 5432
})

console.log('Connected to the database');

const indexRouter = require('./routes/index')(pool);
const usersRouter = require('./routes/users')(pool);
const profilesRouter = require('./routes/profiles')(pool);
const projectsRouter = require('./routes/projects')(pool);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/projects', projectsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;