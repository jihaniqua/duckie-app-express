var express = require('express');
var router = express.Router();

let axios = require('axios');

/* GET home page */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Duckie'
    });
});

/* GET children page */
router.get('/children', (req, res) => {
    res.render('children', {
        title: 'Children'
    });
});

/* GET medical page */
router.get('/medical', (req, res) => {
    res.render('medical', {
        title: 'Medical'
    });
});

/* GET gallery page */
router.get('/gallery', (req, res) => {
    res.render('gallery', {
        title: 'Gallery'
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
