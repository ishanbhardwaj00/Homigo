import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import User from './models/users.model.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import OTP from './models/otp.model.js'

//Middleware
import {
  generateOTP,
  generateOTPExpiry,
  updateOTPForUser,
  isOtpValid,
} from './utils/otp_gen.js'

dotenv.config() // Load environment variables if any (optional)

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

// const cli_id = '3f94a27f-fc95-45d8-bc20-d4da5f5d7331'
// const cli_sec = 'ag9TngY8kxdxfMZwq3sFrOPoFHVyma2b'
// const prod_id = '20c6cfbb-2cc3-4e26-b2b7-4638a3b7ddac'
// // const captha = '2GAD0'
// const adhr_num = 123456
// const otp = 123456
// const shareCode = 1234

const verifyJwt = async (req, res, next) => {
  const { accessToken } = req.cookies
  if (!accessToken) {
    console.log('Access token not found')
    return res.send('<h1>You are not authorized to see this</h1>')
  }
  let decodedToken
  decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

  if (!decodedToken) {
    console.log('Fake token')
    return res.send('<h1>You are not authorized to see this</h1>')
  }

  req.decodedToken = decodedToken
  next()
}

app.get('/api/users/checkAuth', async (req, res) => {
  const accessToken = req.cookies.accessToken

  if (accessToken) {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    )

    if (decodedToken) {
      console.log(decodedToken)
      const user = await User.findById(decodedToken._id)
      if (user && !user.profileCompleted) {
        console.log('Incomplete profile')

        return res.json({
          success: true,
          profileCompleted: false,
          message: 'Incomplete profile',
        })
      }
      return res.json({
        success: true,
        profileCompleted: true,
        message: 'Authenticated',
      })
    }
  }
  return res.json({
    success: false,
    profileCompleted: null,
    message: 'Not authenticated',
  })
})
// app.get('/test-axios', async (req, res) => {
//   try {
//     // First request to get the `id`
//     const options1 = {
//       method: 'post',
//       url: 'https://dg-sandbox.setu.co/api/okyc',
//       headers: {
//         'x-client-id': cli_id,
//         'x-client-secret': cli_sec,
//         'x-product-instance-id': prod_id,
//       },
//       data: { redirectURL: 'https://setu.co' },
//     }

//     const response1 = await axios.request(options1)

//     // Extract the `id` from the first response
//     const st_id1 = response1.data.id
//     console.log('ID from first request:', id)

//     // Now make the second request using the extracted `id`
//     const options2 = {
//       method: 'get',
//       url: `https://dg-sandbox.setu.co/api/okyc/${st_id1}/initiate`,
//       headers: {
//         'x-client-id': cli_id,
//         'x-client-secret': cli_sec,
//         'x-product-instance-id': prod_id,
//         'Content-Type': 'application/json',
//       },
//     }

//     const response2 = await axios.request(options2)

//     // Log the second response
//     console.log('Response from second request:', response2.data)

//     const reqId = response2.data.id

//     const captha_img = response2.data.captchaImage

//     // Send the combined result to the client
//     res.json({
//       firstRequest: response1.data,
//       requestId: reqId,

//       captha_image: captha_img,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('Error occurred while making the requests')
//   }
// })

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
app.patch('/api/users/signup', verifyJwt, async (req, res) => {
  console.log(req.body)
  try {
    const { _id, email } = req.decodedToken

    const user = await User.findOne({ 'userCred.email': email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const {
      verified,
      step,
      registered,
      userDetails: { fullName, dateOfBirth, gender },
      hobbies: {
        nature,
        dietaryPreferences,
        workStyle,
        workHours,
        smokingPreference,
        guestPolicy,
        regionalBackground,
        interests,
      },
      preferences: { locationPreferences, nonVegPreference, lease },
      additionalInfo,
    } = req.body
    console.log(req.body)

    user.userDetails = {
      fullName,
      dateOfBirth,
      gender,
    }

    user.metaDat = {
      image: additionalInfo.image,
      bio: additionalInfo.bio,
      monthlyRent: additionalInfo.monthlyRentPreferences,
    }

    user.hobbies = {
      nature,
      dietaryPreferences,
      workStyle,
      workHours,
      smokingPreference,
      guestPolicy,
      regionalBackground,
      interests,
    }
    user.preferences = {
      location: locationPreferences,
      nonVegPreferences: nonVegPreference,
      lease,
    }

    user.profileCompleted = true

    await user.save() // Save to the database

    const newAccessToken = user.generateAccessToken()

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: false, // Send cookie over HTTPS only in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax', // Ensures the cookie is not sent along with cross-site requests
    })

    const newRefreshToken = user.generateRefreshToken()

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: false, // Send cookie over HTTPS only in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax', // Ensures the cookie is not sent along with cross-site requests
    })

    return res.status(201).json({
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

app.post('/api/users/login', async (req, res) => {
  console.log(req.body)
  try {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ 'userCred.email': email })
    console.log(user)
    if (!user) {
      console.log('not found')
      return res.status(200).json({ message: 'Invalid email or password.' })
    }

    // Check if the password is correct
    const isMatch = await user.isPasswordCorrect(password)
    if (!isMatch) {
      console.log('mismatch')
      return res.status(200).json({ message: 'Invalid email or password.' })
    }

    console.log(user)

    if (!user.profileCompleted) {
      await user.deleteOne({ _id: user._id })

      // Clear the access and refresh token cookies
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')

      return res.status(200).json({
        message: 'Account does not exist',
        success: false,
      })
    }

    // // Generate access token
    const accessToken = user.generateAccessToken()

    // Optionally, generate a refresh token and save it to the user document
    const refreshToken = user.generateRefreshToken()
    user.userCred.refreshToken = refreshToken
    await user.save()

    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: false, // Send cookie over HTTPS only in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax', // Ensures the cookie is not sent along with cross-site requests
    })

    // Optionally, send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    // Return tokens to the client
    res.status(200).json({
      success: true,
      profileCompleted: user.profileCompleted,
      message: 'Login successful',
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3000

app.post('/api/users/logout', verifyJwt, async (req, res) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.json({ success: true, message: 'Logged out' })
})
app.post('/api/users/signup', async (req, res) => {
  console.log('post', req.body)
  try {
    const { email, password } = req.body

    const userExists = await User.findOne({ 'userCred.email': email })

    if (userExists) {
      return res.send({ success: false, message: 'User already exists' })
    }
    const user = new User({
      profileCompleted: false,

      userCred: {
        email,
        password,
      },
    })

    await user.save() // Save to the database

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.userCred.refreshToken = refreshToken

    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Makes sure the cookie is accessible only by web server
      secure: false, // Send cookie over HTTPS only in production
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
      sameSite: 'strict',
    })

    // Optionally, send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
    })

    res.status(201).json({
      success: true,
      id: user._id,
    })

    // res.json()
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Error saving user data',
      error: err.message,
    })
  }
})

app.post('/api/users/generateOtp', async (req, res) => {
  const { email } = req.body

  try {
    // Generate the OTP and its expiry
    const userExists = await User.findOne({ 'userCred.email': email })

    if (userExists && userExists.profileCompleted) {
      return res.status(200).json({
        success: false,
        profileCompleted: null,
        message: 'This email address is already registered',
      })
    } else if (userExists && !userExists.profileCompleted) {
      return res.status(200).json({
        success: true,
        profileCompleted: false,
        message: 'This profile is incompleted',
      })
    }
    const otp = generateOTP()
    const otpExpiry = generateOTPExpiry()

    // Update or insert the OTP and its expiry in the database
    await updateOTPForUser(email, otp, otpExpiry)

    // Set up the email transporter using nodemailer
    const transporter = nodemailer.createTransport({
      secure: true,
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'arjunvir.m@gmail.com',
        pass: 'jevewwnlkhlnkxnz',
      },
    })

    // Send the email with the OTP
    await transporter.sendMail({
      to: email,
      subject: 'Hey, verify your account on HOMIGO',
      html: `<p>The verification code is <strong>${otp}</strong></p>`,
    })

    console.log('Email is sent')
    res.status(200).send({
      success: true,
      profileCompleted: null,
      message: 'OTP sent to your email!',
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    res.status(500).send({ success: false, message: 'Error sending OTP' })
  }
})

app.post('/api/users/verifyOTP', async (req, res) => {
  console.log('VERTIGY', req.body)

  const { email, otp } = req.body
  if (!email || !otp)
    return res.json({
      success: false,
      message: 'Some error occurred. Please try refreshing.',
    })

  try {
    // Validate OTP
    const isValid = await isOtpValid(email, otp)

    if (isValid) {
      // OTP is valid; remove OTP from the database
      await OTP.deleteOne({ email })

      // Check if user exists and password is correct
      // const user = await User.findOne({ "userCred.email": email });

      // if (user && await user.isPasswordCorrect(password)) {
      res
        .status(200)
        .json({ success: true, message: 'OTP verified successfully!' })
      // } else {
      //     res.status(400).send({ message: "Invalid email or password" });
      // }
    } else {
      // OTP is incorrect or expired
      res
        .status(400)
        .json({ success: false, message: 'Invalid OTP or OTP expired' })
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({
      success: false,
      message: 'Server error occured while verifying OTP',
    })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.get('/users', verifyJwt, async (req, res) => {
  const users = await User.find({})

  return res.json({
    success: true,
    users,
  })
})
