const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../Model/userData');
const indexController = require('../Controller/indexController')


//Route to render the HTML page normally
router.get('/', (req,res) => {
    // console.log("Authenticated user: ",req.user) //Check the user Object for testing purposes
    res.render('home/index', { //Render the EJS Template
        user: req.user 
    }) 
})

//The route for handling the signUp
router.post('/signup', async (req,res) => {
    const { username, email, password } = req.body
    
    try{
        //Check if the username already exists
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUser){
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        if (existingEmail){
            return res.status(400).json({ message: 'Email already exists' });
        }

        //Check if all the fields are valid
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //Hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in the user after signUp' });
            }
            //Respond to the client
            res.status(201).json({ message: 'User created successfully', user: newUser });
        })
    }
    catch(error){
        console.log('Error creating user: ', error)
        res.status(500).json({ message: 'Error creating user', error: error});
    }
});

//The route for handling the signIn
router.post('/signin', (req, res, next) => {
    passport.authenticate('local', (error, user,info) => {
        if (error){
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user){
            return res.status(400).json({ message: info.message });
        }

        req.login(user, (error) => {
            if (error) {
                return res.status(500).json({ message: "Error logging in" });
            }
            return res.status(200).json({ message: "Login Successfully" });
        });
    })(req, res, next);
});

//The Route for handling the logOut
router.post('/logout', (req, res) => {
    req.logout((error) => {
        if (error) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.status(200).json({ message: 'Logged Out Successfully' });
    })
})

//Route to return JSON data
router.get('/now-playing', indexController.getNowPlayingMovies)

module.exports = router