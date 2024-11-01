const fetch = require('node-fetch');

exports.getSearchedMovie = async (req, res) => {
  try {
      const query = req.query.q;
      const page = parseInt(req.query.page, 10) || 1;  // Get the current page from the query, default to 1
      const searchURL = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}&api_key=0724dc82124e10da3fea3a23a5ce17ee
`;

      const response = await fetch(searchURL);
      const searchedMovie = await response.json();

      // Check if there are more pages available
      const morePages = searchedMovie.page < searchedMovie.total_pages;

      // Render the results and pass 'morePages' to the view to decide whether to show "Show more" button
      res.render('home/searchedMovie', {
          movies: searchedMovie.results,
          currentPage: page,
          morePages: morePages,
          query,
          page: 'search',
          error: null,
          user: req.session.user || null,
      });

  } catch (err) {
      console.error('Error fetching film details', err);
      res.status(500).send('Error fetching film details');
  }
};
