import express from 'express'
import User from '../models/users.model.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Login Route
router.post('/login', async (req, res) => {
  console.log(req.body)
  try {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ 'userCred.email': email })
    console.log(user)
    if (!user) {
      console.log('not found')
      return res.status(200).json({ message: 'Account does not exist.' })
    }

    // Check if the password is correct
    const isMatch = await user.isPasswordCorrect(password)
    if (!isMatch) {
      console.log('mismatch')
      return res.status(200).json({ message: 'Invalid email or password.' })
    }

    console.log(user)

    // if (!user.profileCompleted) {
    //   await user.deleteOne({ _id: user._id })

    //   // Clear the access and refresh token cookies
    //   res.clearCookie('accessToken')
    //   res.clearCookie('refreshToken')

    //   return res.status(200).json({
    //     message: 'Account does not exist',
    //     success: false,
    //   })
    // }

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

// Logout Route
router.post('/logout', async (req, res) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.json({ success: true, message: 'Logged out' })
})

// Signup Route
router.post('/signup', async (req, res) => {
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

// Check Auth Route
router.get('/checkAuth', async (req, res) => {
  const accessToken = req.cookies.accessToken

  if (accessToken) {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    )

    if (decodedToken) {
      console.log(decodedToken)
      const user = await User.findById(decodedToken._id)
      const userObject = {
        id: user._id,
        email: user.userCred.email,
        fullName: user.userDetails.fullName,
      }

      if (user && !user.profileCompleted) {
        console.log('Incomplete profile')

        return res.json({
          success: true,
          profileCompleted: false,
          user: userObject,
          message: 'Incomplete profile',
        })
      }
      return res.json({
        success: true,
        user: userObject,
        profileCompleted: true,
        message: 'Authenticated',
      })
    }
  }
  return res.json({
    success: false,
    profileCompleted: null,
    user: null,
    message: 'Not authenticated',
  })
})

export default router
