let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let index = require('./controllers/index');
let users = require('./controllers/users');
let auth = require('./controllers/auth');

// custom controllers 
let records = require('./controllers/records');
let artworks = require('./controllers/artworks');

// custom imports
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let passport = require('passport');
let session = require('express-session');

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

// passport local aut config
// session setup
app.use(session({
    secret: 'string-to-be-moved-in-env',
    resave: true,
    saveUninitialized: false
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// link passport to User model
let User = require('./models/user');
passport.use(User.createStrategy());

// enable session for passport users to read and write data
passport.serializeUser(User.serializeUser()); // store user id in session
passport.deserializeUser(User.deserializeUser()); // retrieve user based on stored id in session

app.use('/', index);
app.use('/users', users);
app.use('/records', records);
app.use('/artworks', artworks);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
