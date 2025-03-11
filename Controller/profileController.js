const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const axios = require('axios');
const UserData = require('../Model/userData');
const UserRates = require('../Model/userRates');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/avatars"); // Save in 'public/uploads/avatars'
    },
    filename: (req, file, cb) => {
        cb(null, req.user.id + path.extname(file.originalname)); // Save file with user ID
    }
});

const upload = multer({ storage: storage })

const fetchMovieDetails = async (movieId) => {
    try {
        const options = {
            method: 'GET',
            url: `${process.env.TMDB_BASE_URL}/movie/${movieId}`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTHORIZATION}`
            }
        };

        const response = await axios(options);
        return response.data;
    }
    catch (error) {
        console.error("Can't fetch movie details", error);
        throw new Error("Failed to fetch movie details");
    }
};

exports.getProfileDetails = async (req,res) => {
    try {
        const userId = req.user ? req.user._id : null;

        let userDataDetails = null;
        let watchedMoviesDetails = [];
        let likedMoviesDetails = [];
        let watchListMoviesDetails = [];
        let reviewedMovies = [];
        
        if (userId) {
            const userData = await UserData.findOne({ _id: userId });
            const userRates = await UserRates.find({ userId }); //Fetch all user movies actions {liked,watched,watchlist}
            
            if (userData) {
                userDataDetails = {
                    userName : userData.username,
                    givenName : userData.givenName,
                    familyName : userData.familyName,
                    email : userData.email,
                    location : userData.location,
                    bio : userData.bio,
                    avatar : userData.avatar
                }
                
                //Seperate movie based on actions
                const watchedMovies = userRates.filter(movie => movie.watched);
                const likedMovie = userRates.filter(movie => movie.liked);
                const watchList = userRates.filter(movie => movie.watchList);
                const reviewedMoviesList = userRates.filter(movie => movie.review)

                //fetch movie details separately for each
                watchedMoviesDetails = await Promise.all(watchedMovies.map(movie => fetchMovieDetails(movie.movieId)));

                likedMoviesDetails = await Promise.all(likedMovie.map(async (movie) => {
                    const likedMovies = await fetchMovieDetails(movie.movieId);
                    return {
                        likedMovies,
                        likedTime: movie.updatedAt
                    }
                }));

                watchListMoviesDetails = await Promise.all(watchList.map(async (movie) =>{
                    const watchListDetails = await fetchMovieDetails(movie.movieId);
                    return {
                        watchListDetails,
                        watchListTime: movie.updatedAt
                    }
                }));

                //Fetch movie details with the review of it
                reviewedMovies = await Promise.all(reviewedMoviesList.map(async (movie) => {
                    const movieDetails = await fetchMovieDetails(movie.movieId);
                    return {
                        movieDetails,
                        review: movie.review,
                        reviewTime: movie.updatedAt,
                        rating: movie.rating || 0
                    }
                }))
            }
        }

        return res.status(200).json({
            user: req.user,
            userDataDetails,
            watchedMoviesDetails,
            likedMoviesDetails,
            watchListMoviesDetails,
            reviewedMovies,
        })
    }
    catch (error) {
        console.error("Error fetching profile details", error);
        return res.status(500).json({ message: "Error fetching profile details"})
    }
}

exports.editProfile = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const editData = await UserData.findOneAndUpdate(
            { _id: userId},
            { $set: { 
                givenName: req.body.givenName,
                familyName: req.body.familyName,
                location: req.body.location,
                bio: req.body.bio
            }},
            { new: true} //return the updated document 
        )
    
        if (!editData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: editData
        })
    }
    catch (error) {
        console.error("Error editing profile", error);
        return res.status(500).json({ message: "Error editing profile"})
    }
}

// Controller function to handle avatar upload
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Update the user's avatar path in the database
        const userId = req.user.id;
        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        await UserData.updateOne({ _id: userId }, { $set: { avatar: avatarPath } });

        res.status(200).json({ message: "Avatar updated successfully", avatar: avatarPath });
    } catch (error) {
        console.error("Error updating avatar:", error);
        res.status(500).json({ message: "Error updating avatar" });
    }
};

exports.changePassword = async (req,res) => {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) {
            res.status(403).json("Unauthorized");
        }
        
        const user = await UserData.findOne({ _id: userId });
        if (!user) {
            res.status(401).json({ message: "User not found" });
        }

        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword

        //Check if the entered password matches the current password
        const isMatch = await bcrypt.compare(currentPassword,user.password);
        if (!isMatch) {
            res.status(401).json({message: "Incorrect password" });
        }

        //Check the new password 
        if (newPassword !== confirmPassword) {
            res.status(401).json({ message: "Passwords does not match" });
        }

        //Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword,10)

        //upddate the database
        await UserData.updateOne(
            {_id: userId},
            {
                $set: {
                    password: hashedPassword
                }
            }
        );

        return res.status(200).json({ 
            message: "Changed password successfully",
        });
    }
    catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Error updating password" });
    }
};