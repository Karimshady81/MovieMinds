const axios = require('axios');
const UserRates = require('../Model/userRates');

const fetchAllMovies = async (page = 1) => {
    try {
        const options = {
            method: 'GET',
            url: `${process.env.TMDB_BASE_URL}discover/movie?page=${page}`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        };

        const response = await axios(options);
        return response.data.results; //Return only the "Results" array
    }
    catch (error) {
        console.error("Error fetching all movies", error);
        throw new Error("Failed to fetch all movies")
    }
}

const fetchSearchedMovie = async (page = 1, query) => {
    try {
        const options = {
            method: "GET",
            url: `${process.env.TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        };

        const response = await axios(options);
        return response.data.results;

    } catch (error) {
        console.error("Error fetching searched movies:", error);
        throw new Error("Failed to fetch searched movies");
    }
};

const fetchTotalNumberOfMovies = async () => {
    try {
        const options = {
            method: "GET",
            url: `${process.env.TMDB_BASE_URL}discover/movie`,
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        };

        const response = await axios(options)
        return response.data
    }
    catch (error) {
        console.error("Error fetching all movies", error);
        throw new Error("Failed to fetch all movies")
    }
}

const fetchSingleMovieDetails = async (movieId) => {
    try {
        const options = {
            method: "GET",
            url: `${process.env.TMDB_BASE_URL}/movie/${movieId}`,
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        };

        const response = await axios(options)
        return response.data
    }
    catch (error) {
        console.error("Error fetching single movie", error);
        throw new Error("Failed to fetch single movie");
    }
}

const fetchSingleMovieCredits = async (movieId) => {
    try {
        const options = {
            method: 'GET',
            url: `${process.env.TMDB_BASE_URL}/movie/${movieId}/credits`,
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        }

        const response = await axios(options)
        return response.data;
    }
    catch (error) {
        console.error("Error fetching single movie credits", error);
        throw new Error("Failed to fetch single movie credits");
    }
}

const fetchSingleMovieProviders = async (movieId) => {
    try {
        const options = {
            method: 'GET',
            url: `${process.env.TMDB_BASE_URL}/movie/${movieId}/watch/providers`,
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        }

        const response = await axios(options)
        return response.data;
    }
    catch (error) {
        console.error("Error fetching single movie", error);
        throw new Error("Failed to fetch single movie");
    }
}

const fetchSingleMovieReviews = async (movieId) => {
    try{
        const options = {
            method: "GET",
            url: `${process.env.TMDB_BASE_URL}/movie/${movieId}/reviews`,
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        }
        
        const response = await axios(options)
        return response.data
    }
    catch (error){
        console.error("Failed to fetch single movie review", error);
        throw new Error("Failed to fetch single movie review");
    }
}

const fetchSingleMovieTrailer = async (movieId) => {
    try {
        const options = {
            method: "GET",
            url: `${process.env.TMDB_BASE_URL}/movie/${movieId}/videos`,
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        };

        const response = await axios(options)
        return response.data;
    }
    catch (error) {
        console.error("Error fetching single movie trailer", error);
        throw new Error("Failed to fetch single movie trailer");
    }
}

exports.getAllMovies = async (req, res) => {
    try {
        const {page = 1} = req.query; //Default to page 1, 10 movies per page
        const movies = await fetchAllMovies(page); //Fetch the movies from the logic
        res.status(200).json({ movies, hasMore: movies.length > 0});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getSearchedMovies = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const searchQuery = req.query.query;  // Correctly extract query param

        // console.log("Received search request:", req.query);

        if (!searchQuery) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const movies = await fetchSearchedMovie(page, searchQuery);
        

        return res.status(200).json({
            movies,
            hasMore: movies.length > 0, // Check if more movies exist
        });

    } catch (error) {
        console.error("Error fetching searched movies:", error.message);
        return res.status(500).json({ message: "Failed to fetch searched movies" });
    }
};


exports.getTotalMovies = async (req, res) => {
    try {
        const totalMovies = await fetchTotalNumberOfMovies(); //Fetch the movies from the logic
        return res.status(200).json({ total: totalMovies.total_results });
    }
    catch (error) {
        console.error("Error fetching total number of movies",error.message)
        return res.status(500).json({ message: "Failed to fetch total movies" });
    }
}

exports.getSingleMovieDetails = async (req,res) => {
    try {
        const movieId = req.params.id; //the :id should be in the route
        const userId = req.user ? req.user._id : null;
        const movie = await fetchSingleMovieDetails(movieId);   //pass the movieId to the function for fetching movie details
        const trailer = await fetchSingleMovieTrailer(movieId); //pass the movieId to the function for fetching movie trailer
        const credits = await fetchSingleMovieCredits(movieId); //pass the movieId to the function for fetching movie credits
        const provider = await fetchSingleMovieProviders(movieId); //pass the movieId to the function for fetching movie provider
        const reviews = await fetchSingleMovieReviews(movieId); //pass the movieId to the function for fetching movie review

        let userActions = { watched: false, liked: false, watchlist: false, rating: 0, review: String };

        if (userId) {
            // Fetch user actions from MongoDB
            const userRateData = await UserRates.findOne({ userId, movieId });

            if (userRateData) {
                userActions = {
                    watched: userRateData.watched,
                    liked: userRateData.liked,
                    watchlist: userRateData.watchList,
                    rating: userRateData.rating || 0,
                    review: userRateData.review
                };
            }
        }

        return res.status(200).json({ 
            user: req.user,
            movie, 
            trailer,
            credits,
            provider,
            reviews,
            userActions
         });
    }
    catch (error) {
        console.error("Error fetching details",error.message)
        return res.status(500).json({ message: "Failed to fetch movie details" });
    }
}

exports.addReview = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { movieId, review } = req.body;  

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userReview = await UserRates.findOneAndUpdate(
            { userId, movieId },  
            { $set: { review } }, 
            { new: true, upsert: true }  
        );

        // console.log("Saved Review:", userReview); 

        return res.status(200).json({ message: "Review added successfully", userReview });

    } catch (error) {
        console.error("Error saving review:", error);
        return res.status(500).json({ message: "Error saving review" });
    }
};

exports.removeReview = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { movieId } = req.body;  

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userReview = await UserRates.findOneAndUpdate(
            { userId, movieId },  
            { $unset: { review: "" } }, 
            { new: true, upsert: false}  
        );

        // console.log("Removed Review:", userReview); 

        return res.status(200).json({ message: "Review removed successfully", userReview });

    } catch (error) {
        console.error("Error saving review:", error);
        return res.status(500).json({ message: "Error removing review" });
    }
};
