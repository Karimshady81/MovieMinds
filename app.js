const express = require('express');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');
const movieRoutes = require('./Routes/movieRoutes');
const filmsRoutes = require('./Routes/filmsRoutes');
const userRoutes = require('./Routes/userRoutes');
const searchRoutes = require('./Routes/searchRoute');
const userRateRoute = require('./Routes/userRateRoute');
const profileRoute = require('./Routes/profileRoute');


//Database connection
//We make the cluster in mongoDb then the database and make database access with username and password then add all of these info in the link provided
mongoose.connect('mongodb+srv://karimshady:1Q2w3e4r5t@reviews.k9vxp.mongodb.net/MovieMinds?retryWrites=true&w=majority&appName=Reviews')
.then(() => console.log('Database connected successfully'))
.catch((err) => console.log('Connection error', err));


//Express app()
const app = express();
const port = 3000;

//Acivate session where when activated the user can navigate through the website without having to login in each time
app.use(session({
    secret:'+8"owf;"@6k*Lp',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { maxAge: 1000 * 60 * 60 * 24} // Set session cookie to expire in 1 day
}))

//Register view engine
app.set('view engine', 'ejs');
app.use(express.static((path.join(__dirname, 'Public'))));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//ROUTES
app.use('/', movieRoutes);
app.use('/films', filmsRoutes);
app.use(userRateRoute);
app.use(searchRoutes);
app.use(profileRoute);
app.use(userRoutes); //No need to add the path as the form redirects to /signup and the route handles the POST if you added the /signup the server will look for /signup/signup 

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});