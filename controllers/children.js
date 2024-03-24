let express = require('express');
let router = express.Router();

// Children model for CRUD
let Child = require('../models/child');

/* GET: /children => show list of children page */
router.get('/', async (req, res) => {
    // fetch all data from MongoDB using model
    let children = await Child.find();

    // format birthdate before passing to the view
    children.forEach(child => {
        let birthdate = new Date(child.birthdate);
        // update birthdate format to "Month Day, Year"
        child.updatedDate = birthdate.toLocaleDateString('en-CA', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });
    });

    // load view and display json data
    res.render('children/index', {
        title: 'Children',
        children: children
    });
});

// make public
module.exports = router;