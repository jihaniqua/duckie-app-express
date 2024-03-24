let mongoose = require('mongoose');

// define model for CRUD
let artwork = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date
    },
    child: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String
    }
});

// make model public for controllers
module.exports = mongoose.model('Artwork', artwork);