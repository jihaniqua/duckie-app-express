let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let index = require('./controllers/index');
let users = require('./controllers/users');

// custom controllers 
let records = require('./controllers/records');
let artworks = require('./controllers/artworks');

// custom imports
let mongoose = require('mongoose');
let dotenv = require('dotenv');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect to .env file if not in production mode
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

// mongodb connection
mongoose.connect(process.env.CONNECTION_STRING)
.then((res) => { console.log('Connected to MongoDB') })
.catch(() => { console.log('MongoDB connection failed') });

app.use('/', index);
app.use('/users', users);
app.use('/records', records);
app.use('/artworks', artworks);

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
