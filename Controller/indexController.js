const axios = require('axios');
 
const fetchNowPlayingMovies = async() => {
    try{
        const options = {
            method: 'GET',
            url: `${process.env.TMDB_BASE_URL}movie/now_playing`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        };
    
        const response = await axios(options);
        return response.data.results; //Return only the "Results" array
    } catch (error) {
        console.error("Error fetching now playing movies: ",error.message);
        throw new Error('Failed to fetch now playing movies')
    }
}

exports.getNowPlayingMovies = async (req,res) => {
    try {
        const movies = await fetchNowPlayingMovies(); //Fetch the movies from the logic 
        res.json({ movies });  //Return the movies as JSON
    } 
    catch (error) {
        res.status(500).json({ message: error.message})
    }
}