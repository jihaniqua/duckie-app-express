let express = require('express');
let router = express.Router();

// Records model for CRUD
let Record = require('../models/record');

/* GET: /records => show list of records page */
router.get('/', async (req, res) => {
    // fetch all data from MongoDB using model
    let records = await Record.find();

    // format date before passing to the view
    records.forEach(record => {
        let date = new Date(record.date);
        // update birthdate format to "Month Day, Year"
        record.updatedDate = date.toLocaleDateString('en-CA', {
            month: 'short',
            day: '2-digit',
            year: 'numeric' 
        });
    });

    // load view and display json data
    res.render('records/index', {
        title: 'Health Records',
        records: records
    });
});

/* GET /records/:id => show one item from the list or records */
router.get('/:_id', async (req, res) => {
    let record = await Record.findById(req.params._id);

    let date = new Date(record.date);
        // update birthdate format to "Month Day, Year"
        record.updatedDate = date.toLocaleDateString('en-CA', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });

    res.render('records/details', {
        title: 'Health Record',
        record: record
    });
});

// make public
module.exports = router;