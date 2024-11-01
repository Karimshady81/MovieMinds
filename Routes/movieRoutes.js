const express = require('express');
const router = express.Router();
const moviesController = require('../Controller/moviesController');

//Route for fetching and displaying movies
router.get('/', moviesController.getNowPlayingMovies);

module.exports = router;