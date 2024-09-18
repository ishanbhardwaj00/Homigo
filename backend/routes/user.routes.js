import express from 'express'
import User from '../models/users.model.js'
import verifyJwt from '../middleware/verifyJwt.js' // Move verifyJwt to utils for reuse

const router = express.Router()


// Update user profile (requires authentication)
router.patch('/signup', verifyJwt, async (req, res) => {
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

export default router
