const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    title: String,
    options: [{
        option: String,
        votes: Number
    }],
    createdBy: String
});

module.exports = mongoose.model('Poll', pollSchema);