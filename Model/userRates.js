const mongoose = require('mongoose');

const userRateSchema = new mongoose.Schema({
    userId: {
        type: String, required: true
    },
    movieId: {
        type: String, required: true
    },
    review: {
        type: String
    },
    rating: {
        type: Number, min:0 , max: 5
    },
    watched: {
        type: Boolean, default: false
    },
    liked: {
        type: Boolean, default: false
    },
    watchList: {
        type: Boolean, default: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('UserRate', userRateSchema);