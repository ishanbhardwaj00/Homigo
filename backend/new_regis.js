import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { User } from './models/User'; // Assuming User model is in models/User.js

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route to save user information
app.post('/users', async (req, res) => {
  try {
    const {
      userCred,
      userDetails,
      metaDat,
      hobbies,
      preferences
    } = req.body;

    // Validate and save the user data
    const user = new User({
      userCred,
      userDetails,
      metaDat,
      hobbies,
      preferences
    });

    await user.save(); // Save to the database
    res.status(201).json({
      message: 'User successfully saved',
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error saving user data',
      error: err.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
