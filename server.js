if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const homeRouter = require('./Routes/homeRoute');
const filmsPageRouter = require('./Routes/allFilmsRoute');
const profileRouter = require('./Routes/profileRoute');
const initializePassport = require('./public/JS/password-config');
const User = require('./Model/userData');

//Connect to the database
mongoose.connect('mongodb+srv://karimshady:1Q2w3e4r5t@reviews.k9vxp.mongodb.net/Movie-Minds')
.then(() => console.log('Database connected successfully'))
.catch((err) => console.log('Connection error', err));

//Express app()
const app = express();
const port = 3000;

// Helper functions for intializePassport
const getUserByUsername = async (username) => {
    try{
        return await User.findOne({ username })
    }
    catch (error) {
        console.error("Error finding user by username",error)
        throw error
    }
}

const getUserById = async (id) => {
    try{
        return await User.findById(id)
    }
    catch (error) {
        console.error('Error getting user by id',error)
    }
}

//Passport configuration
initializePassport(
    passport, 
    getUserByUsername,
    getUserById
)

//Register the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//serve static files
app.use(express.static('public'))
app.use(express.json());
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


//This is saying that we can access all the different parameters from the form inside the article Route (Or any other form) by just accessing req.body.kaza
app.use(express.urlencoded({ extended: false }))

//Routes
app.use('/',homeRouter)
app.use(filmsPageRouter)
app.use(profileRouter)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})