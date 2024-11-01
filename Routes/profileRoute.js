const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userRates = require('../Model/userRates');
const User = require('../Model/userData');
const { compare } = require('bcryptjs');

// Set storage destination and filename for uploaded files
const storage = multer.diskStorage({
    destination: './public/uploads/avatars', // Ensure this folder exists
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.get('/profile', async (req, res) => {
    const userID = req.session.userID;

    try {
        //Find all the movies the user has rated
        const userLikes = await userRates.find({ userID: userID, liked: true})
        .sort({createdAt: -1})
        .limit(4);

        const watchList = await userRates.find({ userID: userID, watchlist: true})
        .sort({createdAt: -1})
        .limit(4);

        const userReviewsAndRatings = await userRates.find({
            userID: userID,
            review: { $exists: true, $ne: '' },  // Ensure review exists and is not empty
            rating: { $exists: true, $type: 'number' }  // Ensure rating exists and is a number
        })
        .sort({ createdAt: -1 })
        .limit(4);  // Sort by creation date and limit the number of entries
        
        const userDetails = await User.find({
            userID: userID
        })
                 
        res.render('home/profile', {
            userLikes, 
            watchList,
            userReviews: userReviewsAndRatings,
            page: 'profile',
            userDetails: userDetails,
            user: req.session.user || null,
            error: null,
        })
    }
    catch (error) {
        console.error('Error fetching the user reviews', error);
        res.status(500).json({ message: 'Error fetching the user reviews'});
    }
})


router.get('/editProfile', async (req, res) => {
        
    try {
        res.render('home/editProfile', {
            page: 'editProfile',
            user: req.session.user || null,
            error: null
        });
    }
    catch (error) {
        console.error('Error fetching the user Edit Profile', error);
        res.status(500).json({ message: 'Error fetching the user Edit Profile'});
    }

})

//Route to save the profile details
router.post('/saveProfile', upload.single('avatar'), async (req, res) => {
    const { givenName, familyName, location, bio, currentPassword, newPassword, confirmPassword, } = req.body;
    const userID = req.session.userID 

    if(!newPassword || !confirmPassword){
        return res.status(400).json({message:'must enter a password', success: false});
    }

    let updateFields = {};
  
    if (givenName) updateFields.givenName = givenName;
    if (familyName) updateFields.familyName = familyName;
    if (location) updateFields.location = location;
    if (bio) updateFields.bio = bio;

    const user = await User.findById(userID);  

    if (user && currentPassword){
        if(currentPassword === user.password){
            if (newPassword === confirmPassword){
                updateFields.password = newPassword
            }
            else{
                return res.status(400).json({message:'new passwords do not match', success: false});
            }
        }
        else {
            return res.status(400).json({message: 'current password does not match', success: false});
        }
    }

    if (req.file) {
        updateFields.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    try{
        const updateUserDetails = await User.updateOne(
            { _id: userID }, 
            {$set: updateFields}
        );

        const updatedUser = await User.findById(userID);

        req.session.user = updatedUser;

        res.status(200).json({message: 'User details updated successfully', success: true});
    }
    catch(error){
        console.log('Error updating user details: ', error);
        console.status(500).json({message:'Error updating user details', error});
    }
});

//Router to get all the liked movies
router.get('/allLikedMovies', async (req, res) => {
    const userID = req.session.userID;

    try {
        //Find all the movies the user has rated
        const userLikes = await userRates.find({ userID: userID, liked: true})

        res.render('home/allLikedMovies', {
            userLikes, 
            page: 'profile',
            user: req.session.user || null,
            error: null,
        })
    }
    catch (error) {
        console.error('Error fetching the user reviews', error);
        res.status(500).json({ message: 'Error fetching the user reviews'});
    }
});

router.get('/allWatchList', async (req, res) => {
    const userID = req.session.userID;

    try{
        const watchList = await userRates.find({ userID: userID, watchlist: true})

        res.render('home/allWatchList', {
            watchList,
            page: 'profile',
            user: req.session.user || null,
            error: null
        })
    }
    catch (error) {
        console.error('Error fetching watchlist',error);
        res.status(500).json({ message: 'Error fetching watchlist'});
    }
});


router.get('/allReviewedMovies', async (req, res) => {
    const userID = req.session.userID;

    try{
        const userReviewsAndRatings = await userRates.find({
            userID: userID,
            review: { $exists: true, $ne: ''},
            rating: { $exists: true, $type: 'number' }
        })

        res.render('home/allReviewedMovies', {
            userReviews: userReviewsAndRatings,
            page: 'profile',
            user: req.session.user || null,
            error: null
        })
    }
    catch (err) {
        consol.error('error fetching reviewed movies', err);
        res.status(500).json({message: 'error fetching reviewed movies'})
    }
});

module.exports = router