const express = require('express');
const router = express.Router();
const searchController = require('../Controller/searchController');

router.get('/search',searchController.getSearchedMovie)

module.exports = router;