import { triggerAsyncId } from 'async_hooks';
import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config();

// const Schema = mongoose.Schema;

// Define the schema
const userSchema = new Schema({
    userCred: {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase:true
            // index:true
            // match: [/.+@.+\..+/, "Please enter a valid email"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8
        },

        refreshToken:{
            type: String
        }



       
    },

    userDetails : {
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
            trim: true,
            // index: true
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
            required:true,
            trim: true
        }
    },

    hobbies:{

        nature:{
            type: String,
            required:false
        },

        dietaryPreferences:{
            type: String,
            required: true
        },

        workStyle:{
            type:String,
            required:true
        },
        workHours:{
            type: String,
            required: true
        },
        
        smokingPreference:{
            type: String,
            required: true
        },

        drinkingPreference:{
            type: String,
            required: true
        },
        guestPolicy:{
            type: String,
            required: true
        },

        regionalBackground:{
            type: String,
            required: true
        },


    
   
        interests: [{
            type: String,
            required: true,

        }]
    },

    preferences:{
        location:[{
            type:String,
            required: true

        }],

        nonVegPreferences:{
            type:String,
            required:true
        },

        lease:{
            type: String,
            required: true
        }
    }
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("userCred.password")) return next();
    this.userCred.password = await bcrypt.hash(this.userCred.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password)
{
    return await bcrypt.compare(password, this.userCred.password)
}

userSchema.methods.generateAccessToken = function()
{
    return jwt.sign({
        _id: this._id,
        email: this.userCred.email,
        fullName: this.userDetails.fullName
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function()
{
    return jwt.sign({
        _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
// Create the model
export const User = mongoose.model("User", userSchema);

export default User;
