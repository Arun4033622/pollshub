const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    title: String,
    options: [{
        option: String,
        votes: Number
    }],
    createdBy: String,
    voters: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        ipAddress: String
    }]
});

module.exports = mongoose.model('Poll', pollSchema);