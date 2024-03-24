let mongoose = require('mongoose');

// define model fro CRUD
let record = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    child: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    medication: {
        type: String
    }
});

// make model public for controllers
module.exports = mongoose.model('Record', record);