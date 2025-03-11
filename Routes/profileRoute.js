const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "public/uploads/avatars/"})
const profileController = require('../Controller/profileController');

router.get('/profile', (req, res) => {
    res.render('home/profile', {
        user: req.user
    });
})

router.get('/edit-Profile', (req, res) => {
    res.render('home/editProfile', {
        user: req.user
    })
})

router.get('/allLikedMovies', (req,res) => {
    res.render('home/allLikedMovies', {
        user: req.user
    });
})

router.get('/allWatchListMovies', (req,res) => {
    res.render('home/allWatchListMovies', {
        user: req.user
    });
})

router.get('/allReviewedMovies', (req,res) => {
    res.render('home/allReviewedMovies', {
        user: req.user
    });
})

router.get('/profile-Details', profileController.getProfileDetails)
router.get('/editProfile', profileController.editProfile)
router.post('/editProfile', profileController.editProfile)
router.post('/changePassword', profileController.changePassword)
router.post('/uploadAvatar', upload.single("avatar"), profileController.uploadAvatar);


module.exports = router;