const express = require('express');
const router = express.Router();
const userRates = require('../Model/userRates');

router.post('/saveRating', async (req, res) => {
    const { movieID, action, rating , review} = req.body;
    const userID = req.session.userID;  // Ensure userID is retrieved correctly

    // console.log("movieID:", movieID);  
    // console.log("action:", action);    
    // console.log("userID:", userID);    
    // console.log("rating:", rating);
    // console.log('review: ', review)

    if (!movieID || !action || !userID) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    let updateFields = {};
    if (action === 'watched') {
        updateFields = { watched: true };
    } else if (action === 'removeWatched') {
        updateFields = { watched: false };
    } else if (action === 'liked') {
        updateFields = { liked: true };
    } else if (action === 'removeLike') {
        updateFields = { liked: false };
    } else if (action === 'watchlist') {
        updateFields = { watchlist: true };
    } else if ( action === 'removeWatchList') {
        updateFields = { watchlist: false };
    } else if (action === 'rated') {
        updateFields.rating = rating; 
    } else if (action === 'removeRate') {
        updateFields.rating = rating;
    } else if (action === 'reviewed') {
        updateFields.review = review;
    } else if (action === 'removeReview') {
        updateFields.review = review;
    } else {
        return res.status(400).json({ message: 'Invalid action' });
    }

    try {
        const updatedUserRate = await userRates.findOneAndUpdate(
            { userID: userID, movieID: movieID },
            { $set: updateFields },
            { new: true, upsert: true }  // Create if it doesn't exist
        );

        res.status(200).json({ message: `${action} action saved successfully!`, updatedUserRate });
    } catch (err) {
        console.error('Error saving rating:', err);
        res.status(500).json({ message: 'Could not save the rating', error: err });
    }
});


module.exports = router;