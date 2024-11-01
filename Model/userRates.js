const mongoose = require('mongoose');

const userRateSchema = new mongoose.Schema({
    userID: {
        type: String, required: true
    },
    movieID: {
        type: String, required: true
    },
    review: {
        type: String, 
    },
    rating: {
        type: Number, min:0 , Max: 5
    },
    watched: {
        type: Boolean, default: false
    },
    liked: {
        type: Boolean, default: false
    },
    watchlist: {
        type: Boolean, default: false
    },
}, {
    timestamps: true 
});

const UserRate = mongoose.model('UserRate', userRateSchema);
module.exports = UserRate;