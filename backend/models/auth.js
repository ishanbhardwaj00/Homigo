// const mongoose = require('mongoose');
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

// Define the schema
const userSchema = new Schema({
    userCred: {
        email: {
            type: String,
            required: true,
            unique: true,
            // match: [/.+@.+\..+/, "Please enter a valid email"]
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },

       
    },

    userDet : {
        gender:{
            type: String,
            required: true,

        },

        fullName: {
            type: String,
            required: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        }

    },

    metaDat: {
        image: {
            type: String,
            required: true,
        },

        bio: {
            type: String,
            required: true
        },

        monthlyRent:{
            type: Number,
            required:true
        }
    },
   
    // interest: [{
    //     type: String,
    //     required: true,

    // }]
});

// Create the model
const User = mongoose.model('User', userSchema);

export default User;
