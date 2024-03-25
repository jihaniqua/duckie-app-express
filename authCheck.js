const passport = require('passport');
const User = require('./models/user');

// global auth check
// checks if request is from an authenticated user
let isAuthenticated = (req, res, next) => {
    // if not authenticated, redirent to login page
    if (!req.isAuthenticated()) {
        res.redirect('/auth/login');
        return false;
    }
    // if authenticated, just continue original express callback
    return next();
};

module.exports = isAuthenticated;