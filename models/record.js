let mongoose = require('mongoose');

// define model for CRUD
let record = new mongoose.Schema({
    _id : String,
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
    notes: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

// make model public for controllers
module.exports = mongoose.model('Record', record);