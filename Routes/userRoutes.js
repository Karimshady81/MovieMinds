const express = require('express');
const router = express.Router();
const { fetchMovies } = require('../Controller/moviesController');
const User = require('../Model/userData');

/*
Steps:
1) a post route is used to handle the submission of data
    async is used as it can wait for promises (like saving a user to the database)

2) This destructures email, username, and password from req.body. 
   (destructure means that it will extract the valujes of the data from the object/array and assign them to a variable)
   When a form is submitted, the data sent from the client (like the signup form fields) is accessible through req.body.

3) we are essentially creating a new user object alligned with the userData schema to be save in the database

4) we use .save() provided by the moongose and await to wait for the database operation before moving to the next line

5) we are redirecting to the home page with the username appearing in the nav, to make this work we had to sparate the fetch and render logic in the movieController 
   in order for us to fetch the part we need only 

NOTE: 
1) User sees the signup modal on the homepage (/).
2) User fills out the form with their email, username, and password.
3) When the user submits the form, it is posted to /signup as per the form’s action attribute.
4) The backend server receives the data and routes it to userRoutes.js where the form data is processed, and a new user is saved in the database.*/

router.post('/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // This creates a new user instance using the extracted data and then saves it to the MongoDB database.
        const newUser = new User({ email, username, password });
        await newUser.save();

        // Fetch movies and render home page
        const movies = await fetchMovies();

        /*You're saving the newly registered user to the session so that the server remembers this user during their browsing session.*/
        req.session.user = newUser;
        
        res.json({ success: true, message: 'User registered successfully', movies });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        //This uses object destructuring to extract the username and password fields from the form submission (req.body). 
        //This is the data entered by the user into the form.
        const { username, password } = req.body;
        //Fetch movies
        const movies = await fetchMovies();

        /*
        This waits for the result of querying the database (MongoDB in this case) to find a user by the provided username. 
        The User.findOne() method searches for a matching record in the User collection. If no user is found, user will be null */
        const user = await User.findOne({ username , password });
        

        /*this checks if the user doesn't exist (!user) or if the provided password doesn't match the stored password for that user (user.password !== password).*/
        if (!user) {
            return res.status(404).render('home/index', {
                page: 'home',
                error: 'Your credentials don’t match. It’s probably attributable to human error.', 
                user,
                movies
            });
        }

        /*If the user is found and the password matches, this line stores the user information in the session, creating a "logged-in" state for the user. 
        The session data is stored on the server and associated with the user's session ID.*/
        req.session.user = user;
        req.session.userID = user.id;

        // render home page
        res.render('home/index', { 
            page: 'home',
            user,
            movies,
            error: null 
        });

    } catch (err) {
        console.error('Error signing in', err);
        res.status(500).send('Error signing in');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      res.redirect('/');
    });
});

module.exports = router;