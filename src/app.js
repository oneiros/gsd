console.log("Starting server");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');

const tasksRouter = require('./tasks');

const app = express();

app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(session({ secret: "not so secret", resave: false, saveUninitialized: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, '../css'),
  dest: path.join(__dirname, '../public/stylesheets'),
  prefix: "/stylesheets",
  includePaths: [path.join(__dirname, '../node_modules')],
  debug: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", function(req, res, next) {
  res.redirect("/tasks");
});

app.use('/tasks', tasksRouter);

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
