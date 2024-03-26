let express = require('express');
let router = express.Router();

// for PDF download
let puppeteer = require('puppeteer');

// records model for CRUD
let Record = require('../models/record');

// global auth check
let authCheck = require('../authCheck');

/* GET: /records => show list of records page */
router.get('/', async (req, res) => {
    try {
        // fetch all data of the user logged in from MongoDB using model in descending order
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

/* GET /records/download => download records in pdf of LOGGED IN USER ONLY */
router.get('/download', authCheck, async (req, res) => {
    try{
        // fetch data of the user logged in from MongoDB using model in descending order
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

        // pdf content
        let view = `
            <html>
                <style>
                    body { 
                        margin: 80px 120px;
                        font-family: Inter, sans-serif;
                    }
                    h1, h3, h4 {
                        margin-top: 0;
                    }
                    h3 {
                        margin-bottom: 10px;
                    }
                    h4 {
                        margin-bottom: 10px;
                        font-weight: 400;
                    }
                    h1, p {
                        margin-bottom: 0;
                    }
                    div {
                        padding: 20px;
                        margin-bottom: 20px;
                        border: 1px solid #BCBCBC;
                        border-radius: 8px;
                    }
                    .source {
                        margin-bottom: 30px;
                    }
                </style>
            <body>
                <h1>Health Records PDF</h1>
                <p class="source">Generated from Duckie App. Records created by ${req.user.username}</p>
        `;

        records.forEach(record => {
            view += `
                <div>
                    <h3>${record.event}</h3>
                    <h4>${record.updatedDate} • ${record.child}</h4>
                    <p>${record.notes}</p>
                </div>
            `
        });

        view += `
            </body>
            </html>
        `;

        // launch the browser
        let browser = await puppeteer.launch({
            headless: true,
            executablePath: '/path/to/Chrome'
        });
        // create a page
        let page = await browser.newPage();

        // download pdf
        await page.setContent(view);
        let buffer = await page.pdf({
            format: 'A4'
        });

        await browser.close();

        // send pdf as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="health-records.pdf"');
        res.send(buffer);
    }
    catch (err) {
        console.log('Could not download pdf', err)
    }
});

/* GET /records/download-al => download ALL records in pdf */
router.get('/download-all', authCheck, async (req, res) => {
    try{
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

        // pdf content
        let view = `
            <html>
                <style>
                    body { 
                        margin: 80px 120px;
                        font-family: Inter, sans-serif;
                    }
                    h1, h3, h4 {
                        margin-top: 0;
                    }
                    h3 {
                        margin-bottom: 10px;
                    }
                    h4 {
                        margin-bottom: 10px;
                        font-weight: 400;
                    }
                    h1, p {
                        margin-bottom: 0;
                    }
                    div {
                        padding: 20px;
                        margin-bottom: 20px;
                        border: 1px solid #BCBCBC;
                        border-radius: 8px;
                    }
                    .source {
                        margin-bottom: 30px;
                    }
                </style>
            <body>
                <h1>Health Records PDF</h1>
                <p class="source">Generated from Duckie App</p>
        `;

        records.forEach(record => {
            view += `
                <div>
                    <h3>${record.event}</h3>
                    <h4>${record.updatedDate} • ${record.child}</h4>
                    <p>${record.notes}</p>
                </div>
            `
        });

        view += `
            </body>
            </html>
        `;

        // launch the browser
        let browser = await puppeteer.launch({
            headless: true,
            executablePath: '/path/to/Chrome'
        });
        // create a page
        let page = await browser.newPage();

        // download pdf
        await page.setContent(view);
        let buffer = await page.pdf({
            format: 'A4'
        });

        await browser.close();

        // send pdf as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="health-records.pdf"');
        res.send(buffer);
    }
    catch (err) {
        console.log('Could not download pdf', err)
    }
});

/* GET /records/details/:id => show one item from the health record list */
router.get('/details/:_id', async (req, res) => {
    try {
        // fetch single data by id
        let record = await Record.findById(req.params._id);

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

/* GET /records/details/:id => show one item from the health record list */
router.get('/details/:_id', async (req, res) => {
    try {
        // fetch single data by id
        let record = await Record.findById(req.params._id);

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