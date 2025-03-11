const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username,password,done) => {  
        try{
            const user = await getUserByUsername(username);
            
            
            if (!user){
                return done(null, false, { message: 'No user with that username'})
            }
            
            // console.log(user.username)

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false, { message: 'Password is incorrect' })
            }

            return done(null,user);
        }
        catch (error) {
            return done(error)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user,done) => {
        done(null, user.id) //Store the users ID in the session
    });
    passport.deserializeUser(async (id,done) => {
        try {
            const user = await getUserById(id); //Fetch the user by the ID
            done(null, user); //Attach the user to the req.user
        }
        catch (error) {
            done(error);
        }
    })
}

module.exports = initialize