var express = require('express');
var router = express.Router();

let axios = require('axios');

/* GET home page */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Duckie',
        user: req.user
    });
});

/* GET register page */
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        user: req.user
    });
});

/* GET login page */
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        user: req.user
    });
});

module.exports = router;
