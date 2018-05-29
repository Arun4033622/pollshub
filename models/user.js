const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    twitterId: Number,
    polls: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);