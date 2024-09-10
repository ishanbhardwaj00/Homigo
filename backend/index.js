import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import User from './models/users.model.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

dotenv.config() // Load environment variables if any (optional)

const app = express()
app.use(bodyParser.json())
app.use(express.json())

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
app.post('/api/users/login', async (req, res) => {
  try {
    const { userCred, userDetails, metaDat, hobbies, preferences } = req.body

    // Validate and save the user data
    const user = new User({
      userCred,
      userDetails,
      metaDat,
      hobbies,
      preferences,
    })

    await user.save() // Save to the database
    res.status(201).json({
      message: 'User successfully saved',
      user,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Error saving user data',
      error: err.message,
    })
  }
})


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find the user by email
    const user = await User.findOne({ 'userCred.email': email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if the password is correct
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate access token
    const accessToken = user.generateAccessToken();

    // Optionally, generate a refresh token and save it to the user document
    const refreshToken = user.generateRefreshToken();
    user.userCred.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: true, // Send cookie over HTTPS only in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'strict', // Ensures the cookie is not sent along with cross-site requests
    });
  
    // Optionally, send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})