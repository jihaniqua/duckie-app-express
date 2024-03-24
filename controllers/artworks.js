let express = require('express');
let router = express.Router();

// Artworks model for CRUD
let Artwork = require('../models/artwork');

/* GET: /artworks => show artwork gallery page */
router.get('/', async (req, res) => {
    // fetch all data from MongoDB using model
    let artworks = await Artwork.find();

    // format birthdate before passing to the view
    artworks.forEach(artwork => {
        let date = new Date(artwork.date);
        // update birthdate format to "Month Day, Year"
        artwork.updatedDate = date.toLocaleDateString('en-CA', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });
    });

    // load view and display json data
    res.render('artworks/index', {
        title: 'Artworks',
        artworks: artworks
    });
});

// make public
module.exports = router;