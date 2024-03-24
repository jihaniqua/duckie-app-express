let express = require('express');
let router = express.Router();

// Records model for CRUD
let Record = require('../models/record');

/* GET: /records => show list of records page */
router.get('/', async (req, res) => {
    try {
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
    } catch {
        console.log('Could not load records')
    }
});

/* GET /records/:id => show one item from the list or records */
router.get('/details/:_id', async (req, res) => {
    // fetch single data by id
    let record = await Record.findById(req.params._id);

    if (!record) {
        return res.status(404).send('Record not found');
    }
    
    // load view and display single record
    res.render('records/details', {
        title: 'Health Record Details',
        record: record
    });
});

/* GET /records/create => show form to create a record */
router.get('/create', (req, res) => {
    res.render('records/create', {
        title: 'Create New Record'
    })
});

// make public
module.exports = router;