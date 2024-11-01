const fetch = require('node-fetch');

const fetchMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNzI0ZGM4MjEyNGUxMGRhM2ZlYTNhMjNhNWNlMTdlZSIsIm5iZiI6MTcyNTczODkyMS4xMzk1NDMsInN1YiI6IjY2ZGNhZWM1YjE1YWFkNzgwN2I5MjNkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-4rUxqumqgkEuiIZuF5cl5xO1zQXbwE5DNZGJrlGVXg'
        }
    };
    
    const response = await fetch(url, options);
    const data = await response.json();
    return data.results;
};

exports.getNowPlayingMovies = async (req, res) => {
    try {
        const movies = await fetchMovies();

        // Check if the user is logged in using the session
        let user = req.session.user;

        res.render('home/index', { 
            movies, 
            page: 'home',
            user: user || null,
            error: null,
        });
    } catch (err) {
        console.error('Error fetching movie', err);
        res.status(500).send('Error fetching movie');
    }
};

exports.fetchMovies = fetchMovies; // Export fetch logic separately for reuse



