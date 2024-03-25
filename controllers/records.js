let express = require('express');
let router = express.Router();

// Records model for CRUD
let Record = require('../models/record');

// global auth check
let authCheck = require('../authCheck');

/* GET: /records => show list of records page */
router.get('/', authCheck, async (req, res) => {
    try {
        // fetch all data of the user logged in from MongoDB using model in descending order
        let records = await Record.find({ username: req.user.username }).sort({ 'date': -1 });

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

        // load view, set page title and display json data
        res.render('records/index', {
            title: 'Health Records',
            records: records,
            user: req.user
        });
    } catch (err) {
        console.log('Could not load records', err)
    }
});

/* GET /records/details/:id => show one item from the health record list */
router.get('/details/:_id', authCheck, async (req, res) => {
    try {
        // fetch single data by id
        let record = await Record.findById(req.params._id);

        // owner check
        if (req.user.username !== record.username) {
            res.redirect('/auth/unauthorized');
            return;
        }
        else {
            let date = new Date(record.date);

            // update date format to "Month Day, Year"
            record.updatedDate = date.toLocaleDateString('en-CA', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
            
            // load view, set page title and display single record
            res.render('records/details', {
                title: 'Health Record Details',
                record: record,
                user: req.user
            });
        }
    } catch (err) {
        console.log('Could not load record details', err);
    }
});

/* GET /records/create => show form to create a record */
router.get('/create', authCheck, (req, res) => {
    res.render('records/create', {
        title: 'Create New Record',
        user: req.user
    });
});

/* POST /records/create => process form submission to save new health record */
router.post('/create', authCheck, async (req, res) => {
    try {
        // use mongoose model to save new record to MongoDB
        await Record.create(req.body);

        // after creation, redirect to index to see updated health record list
        res.redirect('/records');
    } catch (err) {
        console.log('Failed to create a new record', err);
    }
});

/* GET /records/delete/:id => delete selected record and redirect */
router.get('/delete/:_id', authCheck, async (req, res) => {
    try {
        let record = await Record.findById(req.params._id);

        // owner check
        if (req.user.username !== record.username) {
            res.redirect('/auth/unauthorized');
            return;
        }
        else {
            await record.deleteOne({ _id: record._id });

            // after deletion, redirect to index to see updated health record list
            res.redirect('/records');
        }
    } catch (err) {
        console.log('Failed to delete record', err);
    }
});

/* GET /records/edit/:id => show form to edit a record */
router.get('/edit/:_id', authCheck, async (req, res) => {
    try {
        // fetch single data by id
        let record = await Record.findById(req.params._id);

        // owner check
        if (req.user.username !== record.username) {
            res.redirect('/auth/unauthorized');
            return;
        }
        else {
            let date = new Date(record.date);

            // update date format to "YYYY-MM-DD"
            record.updatedDate = date.toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            // load view, set page title and display json data
            res.render('records/edit', {
                title: 'Edit Health Record Details',
                record: record,
                user: req.user
            });
        }
    } catch (err) {
        console.log('Could not load record details', err);
    }
});

/* POST /records/edit/:id => save changes made on form */
router.post('/edit/:_id', authCheck, async (req, res) => {
    try {
        await Record.findByIdAndUpdate(req.params._id, req.body);

        // after deletion, redirect to index to see updated health record list
        res.redirect('/records');
    } catch (err) {
        console.log('Failed to edit record', err);
    }
});

// make public
module.exports = router;