const express = require('express');
const router = express.Router();
const filmsController = require('../Controller/filmsController');

router.get('/', filmsController.getAllMovies);
router.get('/:id', filmsController.getMovieDetails)
router.get('/:id/fullReviews', filmsController.getMovieReview)

module.exports = router;