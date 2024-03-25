let mongoose = require('mongoose');

// define model for CRUD
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
    notes: {
        type: String
    },
    username: {
        type: String,
        required: true
    }
});

// keyword search: to fix - not fetching queries
// search text keyword on child, event and notes functionality
// record.index({ 
//     child: 'text', 
//     event: 'text',
//     notes: 'text'
// });

// make model public for controllers
module.exports = mongoose.model('Record', record);