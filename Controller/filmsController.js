const { name } = require('ejs');
const fetch = require('node-fetch');
const API_KEY = '0724dc82124e10da3fea3a23a5ce17ee';
const baseUrl = 'https://api.themoviedb.org/3';


// Helper function to make fetch requests
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
}

// Fetch movie details
async function getMovieDetailsById(movieID) {
  const movieUrl = `${baseUrl}/movie/${movieID}?api_key=${API_KEY}`;
  return fetchData(movieUrl);
}

// Fetch movie credits
async function getMovieCredits(movieID) {
  const creditsUrl = `${baseUrl}/movie/${movieID}/credits?api_key=${API_KEY}`;
  return fetchData(creditsUrl);
}

// Fetch movie trailer
async function getMovieTrailer(movieID) {
  const trailerUrl = `${baseUrl}/movie/${movieID}/videos?api_key=${API_KEY}`;
  return fetchData(trailerUrl);
}

// Fetch movie watch providers
async function getMovieProviders(movieID) {
  const providerUrl = `${baseUrl}/movie/${movieID}/watch/providers?api_key=${API_KEY}`;
  return fetchData(providerUrl);
}

// Fetch movie reviews
async function getMovieReviews(movieID) {
  const reviewsUrl = `${baseUrl}/movie/${movieID}/reviews?api_key=${API_KEY}`;
  return fetchData(reviewsUrl);
}

// Fetch movie genres
async function getMovieGenres(movieID) {
  const genreUrl = `${baseUrl}/movie/${movieID}?api_key=${API_KEY}`;
  return fetchData(genreUrl);
}

exports.getAllMovies = async (req,res) => {
    const pages = parseInt(req.query.page) || 1;
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pages}&sort_by=popularity.desc`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNzI0ZGM4MjEyNGUxMGRhM2ZlYTNhMjNhNWNlMTdlZSIsIm5iZiI6MTcyNTczOTEyOC45Mzc1NjUsInN1YiI6IjY2ZGNhZWM1YjE1YWFkNzgwN2I5MjNkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-s3pgRr1xTHqaqum8O3lL4k-u7dL7_2S9VabbFByKvo'
        }
    };

    try{
        const response = await fetch(url,options);
        const data = await response.json();

        // Check if the user is logged in using the session
        let user = req.session.user;

        res.render('home/films', {
            films: data.results,
            currentPage: pages,
            totalPages: data.total_pages,
            user: user || null,
            error: null,
            page: 'films'})
    }
    catch(err){
        console.error('Error fetching film', er);
        res.status(500).send('error fetching film')
    }
};

// Controller function
exports.getMovieDetails = async (req, res) => {
  const movieID = req.params.id;
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w45/';
  let user = req.session.user;
  const userID = req.session.userID;
  const userRates = require('../Model/userRates');

  try {
      // Fetch all required data in parallel using Promise.all
      const [
          movieDetails,
          credits,
          trailerData,
          movieGenre,
          movieProviders,
          reviews
      ] = await Promise.all([
          getMovieDetailsById(movieID),
          getMovieCredits(movieID),
          getMovieTrailer(movieID),
          getMovieGenres(movieID),
          getMovieProviders(movieID),
          getMovieReviews(movieID)
      ]);

      // Process movie crew details
      const crewList = {
          directors: [],
          producers: [],
          writers: [],
          editors: [],
          cinematographers: [],
          visualeffects: [],
          sounds: []
      };

      credits.crew.forEach(crewMember => {
          if (crewMember.department === "Directing") crewList.directors.push(crewMember.name);
          if (crewMember.department === "Production") crewList.producers.push(crewMember.name);
          if (crewMember.department === "Writing") crewList.writers.push(crewMember.name);
          if (crewMember.department === "Editing") crewList.editors.push(crewMember.name);
          if (crewMember.department === "Camera") crewList.cinematographers.push(crewMember.name);
          if (crewMember.department === "Visual Effects") crewList.visualeffects.push(crewMember.name);
          if (crewMember.department === "Sound") crewList.sounds.push(crewMember.name);
      });

      // Process movie cast details
      const casts = credits.cast.filter(person => person.known_for_department === "Acting");
      const castList = casts.map(cast => ({
          name: cast.name,
          character: cast.character
      }));

      // Process genres
      const genresList = movieGenre.genres.map(genre => ({
          name: genre.name
      }));

      // Process providers (rent/buy options)
      const bothOption = {};
      Object.keys(movieProviders.results).forEach(region => {
          if (region === "US") {
              if (movieProviders.results[region].rent) {
                  movieProviders.results[region].rent.forEach(provider => {
                      if (!bothOption[provider.provider_name]) {
                          bothOption[provider.provider_name] = {
                              name: provider.provider_name,
                              logo: `${imageBaseUrl}${provider.logo_path}`,
                              rent: true,
                              buy: false
                          };
                      }
                  });
              }
              if (movieProviders.results[region].buy) {
                  movieProviders.results[region].buy.forEach(provider => {
                      if (bothOption[provider.provider_name]) {
                          bothOption[provider.provider_name].buy = true;
                      } else {
                          bothOption[provider.provider_name] = {
                              name: provider.provider_name,
                              logo: `${imageBaseUrl}${provider.logo_path}`,
                              rent: false,
                              buy: true
                          };
                      }
                  });
              }
          }
      });

      // Process the trailer
      const finalTrailer = trailerData.results.find(trailer => trailer.type === "Trailer");
      const trailerUrl = finalTrailer ? `https://www.youtube.com/embed/${finalTrailer.key}` : null;

      // Convert reviews into clickable links
      function linkify(text) {
          const urlPattern = /(https?:\/\/[^\s]+)/g;
          return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: hsl(36, 80%, 58%)">$1</a>');
      }

      // Process movie reviews
      const reviewsList = reviews.results.map(review => ({
          author: review.author,
          rating: review.author_details.rating,
          content: linkify(review.content),
          avatar: `${imageBaseUrl}${review.author_details.avatar_path}`
      }));

      //Check the user rating for the movie
      let userRating;
      if (userID) {
        userRating = await userRates.findOne({ userID: userID, movieID: movieID});
      }

      // Render the film details page
      res.render('home/filmDetails', {
          movieID,
          movie: movieDetails,
          director: crewList.directors.length > 0 ? crewList.directors[0] : 'Unknown director',
          finalTrailer: trailerUrl || 'No trailer available',
          casts: castList,
          crews: crewList,
          genres: genresList,
          provider: bothOption,
          reviews: reviewsList,
          user: user || null,
          error: null,
          userRating,
          page: ''
      });
  } catch (err) {
      console.error('Error fetching film details:', err);
      res.status(500).send('Error fetching film details');
  }
};

exports.getMovieReview = async (req,res) => {
  const movieID = req.params.id;
  const reviewsURL = `https://api.themoviedb.org/3/movie/${movieID}/reviews?api_key=0724dc82124e10da3fea3a23a5ce17ee`;
  const movieUrl = `https://api.themoviedb.org/3/movie/${movieID}?api_key=0724dc82124e10da3fea3a23a5ce17ee`;

  try {

    const response = await fetch(movieUrl);
    const movieDetails = await response.json();

    const reviewResponse = await fetch(reviewsURL);
    const reviews = await reviewResponse.json();

    // Check if the user is logged in using the session
    let user = req.session.user;

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w45/';

    // Function to convert URLs into clickable links
    function linkify(text) {
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: hsl(36, 80%, 58%)">$1</a>');
    }
    //Find the review of each movie 
    const movieReviews = reviews.results
    const reviewsList = movieReviews.map(review => ({
      author: review.author,
      rating: review.author_details.rating,
      content: linkify(review.content),
      avatar: `${imageBaseUrl}${review.author_details.avatar_path}`
    }));

    res.render('home/fullReviews', {
      movie: movieDetails,
      review: reviewsList,
      user: user || null,
      error: null,
      page: ''
    });
  }
  catch (err) {
        console.error('Error fetching film details', err);
        res.status(500).send('Erorr fetching film details')
  }
};

// Export fetch logic separately for reuse
exports.getMovieDetailsById = getMovieDetailsById;

