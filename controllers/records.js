let express = require('express');
let router = express.Router();

// Records model for CRUD
let Record = require('../models/record');

/* GET: /records => show list of records page */
router.get('/', async (req, res) => {
    try {
        // fetch all data from MongoDB using model in descending order
        let records = await Record.find().sort({ 'date': -1 });

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

/* GET /records/details/:id => show one item from the health record list */
router.get('/details/:_id', async (req, res) => {
    try {
        // fetch single data by id
        let record = await Record.findById(req.params._id);

        if (!record) {
            console.log('No data fetched');
        } 

        let date = new Date(record.date);

        // update date format to "Month Day, Year"
        record.updatedDate = date.toLocaleDateString('en-CA', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
        
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
    try {
        // use mongoose model to save new record to MongoDB
        await Record.create(req.body);

        // after creation, redirect to index to see updated health record list
        res.redirect('/records');
    } catch (error) {
        console.log('Failed to create a new record', error);
    }
});

/* GET /records/delete/:id => delete selected record and redirect */
router.get('/delete/:_id', async (req, res) => {
    try {
        await Record.findByIdAndDelete(req.params._id);

        // after deletion, redirect to index to see updated health record list
        res.redirect('/records');
    } catch (error) {
        console.log('Failed to delete record', error);
    }
});

/* GET /records/edit/:id => show form to edit a record */
router.get('/edit/:_id', async (req, res) => {
    try {
        // fetch single data by id
        let record = await Record.findById(req.params._id);

        let date = new Date(record.date);

        // update date format to "YYYY-MM-DD"
        record.updatedDate = date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        // load view and pass data
        res.render('records/edit', {
            title: 'Edit Health Record Details',
            record: record
        });
    } catch (error) {
        console.log('Could not load record details', error);
    }
});

/* POST /records/edit/:id => save changes made on form */
router.post('/edit/:_id', async (req, res) => {
    try {
        await Record.findByIdAndUpdate(req.params._id, req.body);

        // after deletion, redirect to index to see updated health record list
        res.redirect('/records');
    } catch (error) {
        console.log('Failed to edit record', error);
    }
});

// make public
module.exports = router;