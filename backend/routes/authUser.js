import express from 'express';
import mongoose from 'mongoose';
import User from '../models/auth'; // Adjust the path to where your schema is located
import dotenv from 'dotenv'

const app = express();
const PORT = 3000;
// const PORT = process.env.PORT

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect('mongodb+srv://<db_username>:<db_password>@cluster0.0cg5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.error('MongoDB connection error:', err));

// POST route to create a new user
app.post('/api/users/login', async (req, res) => {
    try {
        // Create a new user instance using the request body
        const newUser = new User({
            userCred: {
                email: req.body.userCred.email,
                password: req.body.userCred.password,
            },
            userDet: {
                gender: req.body.userDet.gender,
                fullName: req.body.userDet.fullName,
                dateOfBirth: new Date(req.body.userDet.dateOfBirth),
            },
            metaDat: {
                image: req.body.metaDat.image,
                bio: req.body.metaDat.bio,
                monthlyRent: req.body.metaDat.monthlyRent,
            }
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // Send the saved user back in the response

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
