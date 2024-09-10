import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import User from './models/users.model.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from "cors"
import jwt from 'jsonwebtoken'

dotenv.config() // Load environment variables if any (optional)

const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(cookieParser());

const cli_id = '3f94a27f-fc95-45d8-bc20-d4da5f5d7331'
const cli_sec = 'ag9TngY8kxdxfMZwq3sFrOPoFHVyma2b'
const prod_id = '20c6cfbb-2cc3-4e26-b2b7-4638a3b7ddac'
// const captha = '2GAD0'
const adhr_num = 123456
const otp = 123456
const shareCode = 1234
app.get('/test-axios', async (req, res) => {
  try {
    // First request to get the `id`
    const options1 = {
      method: 'post',
      url: 'https://dg-sandbox.setu.co/api/okyc',
      headers: {
        'x-client-id': cli_id,
        'x-client-secret': cli_sec,
        'x-product-instance-id': prod_id,
      },
      data: { redirectURL: 'https://setu.co' },
    }

    const response1 = await axios.request(options1)

    // Extract the `id` from the first response
    const st_id1 = response1.data.id
    console.log('ID from first request:', id)

    // Now make the second request using the extracted `id`
    const options2 = {
      method: 'get',
      url: `https://dg-sandbox.setu.co/api/okyc/${st_id1}/initiate`,
      headers: {
        'x-client-id': cli_id,
        'x-client-secret': cli_sec,
        'x-product-instance-id': prod_id,
        'Content-Type': 'application/json',
      },
    }

    const response2 = await axios.request(options2)

    // Log the second response
    console.log('Response from second request:', response2.data)

    const reqId = response2.data.id

    const captha_img = response2.data.captchaImage

    // Send the combined result to the client
    res.json({
      firstRequest: response1.data,
      requestId: reqId,

      captha_image: captha_img,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error occurred while making the requests')
  }
})

app.get('/', (req, res) => {
  res.send('Work in progress')
})

mongoose
  .connect(
    'mongodb+srv://arjunvirm:Bravearcher20@cluster0.0cg5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err))

// POST route to create a new user
app.patch('/api/users/signup', async (req, res) => {



  console.log(req.body)
  try {

    const { accessToken } = req.cookies;

    let decodedToken;
    if(accessToken)
    {
      try {
        decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      } catch(err){
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    } else {
      return res.status(401).json({ message: 'Access token missing' });
      }

    const { _id, email } = decodedToken;

    const user = await User.findOne({ 'userCred.email': email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { verified, step, registered,  
      userDetails: {fullName, dateOfBirth, gender}, 
      hobbies:{
        nature, 
        dietaryPreferences, 
        workStyle, 
        workHours, 
        smokingPreference, 
        guestPolicy, 
        regionalBackground, 
        interests}, 
      preferences:{locationPreferences, nonVegPreference, lease}, 
      additionalInfo } = req.body

      user.userDetails = {
        fullName,
        dateOfBirth,
        gender,
      };

      user.metaDat = {
        image:additionalInfo.image,
        bio: additionalInfo.bio,
        monthlyRent: additionalInfo.monthlyRentPreferences
      },
      hobbies,
      preferences,
    })

    await user.save() // Save to the database
    

    const newAccessToken = user.generateAccessToken();

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: false, // Send cookie over HTTPS only in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax', // Ensures the cookie is not sent along with cross-site requests
    });

    const newRefreshToken = user.generateRefreshToken();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: false, // Send cookie over HTTPS only in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax', // Ensures the cookie is not sent along with cross-site requests
    });

    return res.status(201).json({
      message: 'User successfully saved',
      user
    })

  } catch (err) {
    // console.error(err)
    res.status(500).json({
      message: 'Error saving user data',
      error: err.message,
    })
  }
})


app.post('/api/users/login', async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ 'userCred.email': email});
    console.log(user);
    if (!user) {
      return res.status(200).json({ message: 'Invalid email or password.' });
    }

    // Check if the password is correct
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(200).json({ message: 'Invalid email or password.' });
    }

    console.log(user)

    if (!user.profileCompleted) {
      await user.deleteOne({ _id: user._id });

      // Clear the access and refresh token cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return res.status(200).json({
        message: "Account does not exist",
        success: false
      });
    }

    // // Generate access token
    const accessToken = user.generateAccessToken();

    // Optionally, generate a refresh token and save it to the user document
    const refreshToken = user.generateRefreshToken();
    user.userCred.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: false, // Send cookie over HTTPS only in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax', // Ensures the cookie is not sent along with cross-site requests
    });
  
    // Optionally, send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    // Return tokens to the client
    res.status(200).json({
      message: 'Login successful',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000


app.post('/api/users/signup', async (req, res) => {
  
  console.log(req.body)
  try {
    const { email, password}   = req.body;

    const userExists = await User.findOne({ 'userCred.email': email});


    if(userExists) {

      return res.send({success: false, message: "User already exists"})
    }
      const user = new User({

        profileCompleted:false,
  
        userCred:{
          email, password
        }
      })
  
      await user.save() // Save to the database

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.userCred.refreshToken = refreshToken;

  
      res.cookie('accessToken', accessToken, {
        httpOnly: true, // Makes sure the cookie is accessible only by web server
        secure: false, // Send cookie over HTTPS only in production
        maxAge: 1000 * 60 * 15, // 15 minutes
        sameSite: 'strict'
      });
    
      // Optionally, send refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: 'strict',
      });
      
      res.status(201).json({
        success: true,
        id: user._id,
      });
      
      // res.json()
    } catch (err) {
      console.error(err)
      res.status(500).json({
        message: 'Error saving user data',
        error: err.message,
      })
    }
  })
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })