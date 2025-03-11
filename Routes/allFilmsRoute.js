const express = require('express');
const router = express.Router();
const filmsPageController = require('../Controller/filmsController');
const UserRate = require('../Model/userRates');

//Router to render the All Films page normally
router.get('/films', (req,res) => {
    res.render('home/filmsPage', {
        user: req.user
    })
});

router.get('/searched-films', (req,res) => {
    res.render('home/searchedMovies', {
        user: req.user
    })
});

//Get the Film Details page
router.get('/films/:id', (req, res) => {
       res.render('home/filmDetails', {
            user: req.user
        })
})

//Route to return JSON data
router.get('/all-films', filmsPageController.getAllMovies)
router.get('/searched-movies', filmsPageController.getSearchedMovies)
router.get('/total-films',filmsPageController.getTotalMovies)
router.get('/film-details/:id', filmsPageController.getSingleMovieDetails)

//route to handle the user Review
router.post('/addReview', filmsPageController.addReview)
router.post('/removeReview', filmsPageController.removeReview)


//This is to save the user actions
router.post('/user/action', async (req, res) => {
    if (!req.user) 
        return res.status(401).json({ error: "User not logged in"})

    const { movieId, action } = req.body;
    const userId = req.user._id;

    try {
        let userAction = await UserRate.findOne({ userId, movieId });
        if (!userAction) 
            userAction = new UserRate({ userId, movieId });

        userAction[action] = !userAction[action];
        await userAction.save();

        res.json({ success: true, action: userAction })
    }
    catch (error) {
        console.error("Error saving action", error)
        res.status(500).json({ error: "Failed to save action" })
    }
})

router.post('/user/rating', async (req,res) => {
    if (!req.user) 
        return res.status(401).json({ error: "User not logged in"})

    const { movieId, rating } = req.body;
    const userId = req.user._id;

    try {
        let userAction = await UserRate.findOne({ userId, movieId });
        if (!userAction)
            userAction = new UserRate({ userId, movieId });

        userAction.rating = rating;
        await userAction.save();

        res.json({ success: true, rating: userAction.rating})
    }
    catch (error) {
        console.error("Error Saving rating",error);
        res.status(500).json({ error: "Failed to save rating"})
    }
})

module.exports = router;