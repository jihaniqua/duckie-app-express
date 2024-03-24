let mongoose = require('mongoose');

// define model fro CRUD
let child = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date
    }
});

// make model public for controllers
module.exports = mongoose.model('Child', child);