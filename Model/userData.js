const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    givenName:{
        type: String
    },
    familyName:{
        type: String
    },
    location:{
        type: String
    },
    bio:{
        type: String
    },  
    avatar: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('User', userDataSchema);