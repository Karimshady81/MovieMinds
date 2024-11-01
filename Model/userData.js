const mongoose = require('mongoose');

/*This is the schema which handles the way the data should look in the database we have 
{username, email , password} 
these data each have thier own keys to define somethings 
this defines the userdata structure
*/

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    givenName: {
        type: String,
    },
    familyName: {
        type: String
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;