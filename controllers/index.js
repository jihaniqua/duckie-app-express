var express = require('express');
var router = express.Router();

let axios = require('axios');

/* GET home page */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Duckie'
    });
});

/* GET register page */
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
    });
});

/* GET login page */
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    });
});

module.exports = router;
