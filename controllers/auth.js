const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* GET /register => shows registration form */
router.get('/register', (req, res) => {
    res.render('auth/register', { 
        title: 'Register',
        user: req.user 
    });
});

/* POST /register => use passport local to register a new user with a hased password and redirect to records */
router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, newUser) => {
        if (err) {
            console.log(err);
            return res.render('auth/register');
        }
        else {
            req.login(newUser, (err) => {
                res.redirect('/records');
            });
        }
    });
});

/* GET /login => shows login form */
router.get('/login', (req, res) => {
    // get any err messages from session
    let messages = req.session.messages || [];
    
    // clear out session error messages
    //
    req.session.messages = [];

    res.render('auth/login', { 
        title: 'Login',
        messages: messages,
        user: req.user
     });
});

/* POST /login => process login form submission */
router.post('/login', passport.authenticate('local', {
    // on success, redirect to records
    successRedirect: '/records',
    // on failure, redirect back to login with failure message
    failureRedirect: '/auth/login',
    failureMessage: 'Invalid Login'
}));

/* GET /logout => logout and redirect to root */
router.get('/logout', (req, res) => {
    // clear session
    req.session.messages = [];
    req.logout((err) => {
        res.redirect('/');
    });
});

/* GET /unauthorized => shows a page for unauthorized access */
router.get('/unauthorized', (req, res) => {
    res.render('auth/unauthorized', {
        title: 'Unauthorized',
        user: req.user
    });
});

module.exports = router;