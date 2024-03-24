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
    } catch (error) {
        console.log('Could not load records', error)
    }
});

// !!!!!! FIX THIS LATER
/* GET /records/details/:id => show one item from the health record list */
router.get('/details/:_id', async (req, res) => {
    try {
        // fetch single data by id
        let record = await Record.findById(req.params._id);

        if (!record) {
            console.log('No data fetched');
        } 

        // let date = new Date(record.date);

        // // update date format to "Month Day, Year"
        // record.updatedDate = date.toLocaleDateString('en-CA', {
        //     month: 'short',
        //     day: '2-digit',
        //     year: 'numeric'
        // });
        
        // load view and display single record
        res.render('records/details', {
            title: 'Health Record Details',
            record: record
        });
    } catch (error) {
        console.log('Could not load record details', error);
    }
});

/* GET /records/create => show form to create a record */
router.get('/create', (req, res) => {
    res.render('records/create', {
        title: 'Create New Record'
    });
});

/* POST /records/create => process form submission to save new health record */
router.post('/create', async (req, res) => {
    // use mongoose model to save new post to MongoDB
    await Record.create(req.body);

    // reload the records/index to see updated health record list
    res.redirect('/records');
});

// make public
module.exports = router;