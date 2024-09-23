import express from 'express'
import User from '../models/users.model.js'
import verifyJwt from '../middleware/verifyJwt.js' // Move verifyJwt to utils for reuse
import { upload } from '../middleware/multer.middleware.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import fs from 'fs/promises'
const router = express.Router()


router.post('/upload', upload.single('image'), (req, res) => {

  console.log(req.file, req.body)
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send('File uploaded successfully.');
});


// Update user profile (requires authentication)
router.patch('/signup', verifyJwt, upload.single('image'), async (req, res) => {
  console.log(req.body)
  try {
    const { _id, email } = req.decodedToken

    const user = await User.findOne({ 'userCred.email': email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }


    let imageUrl = null;
    // if(req.file) {
    //   const localFilePath = req.file.path;

    //   try {
    //     await fs.access(localFilePath);// Check for file existence

    //     console.log(localFilePath)

    //     const cloudinary_response = await uploadOnCloudinary(localFilePath);

    //     console.log(cloudinary_response.url)

    //     // Remove the file after upload
    //     // await fs.unlink(localFilePath);

    //     if (cloudinary_response) {
    //       imageUrl = cloudinary_response.url;
    //     }
    //   } catch (err) {
    //     console.error("File not found or cannot be accessed:", localFilePath);
    //   }
    // }

    if (req.file && req.file.path) {
      const localFilePath = req.file.path;
      try {
        await fs.access(localFilePath);
        console.log('File exists at: ', localFilePath);
      } catch (err) {
        console.error('File cannot be accessed: ', err);
      }
  
      try {
            await fs.access(localFilePath);// Check for file existence
    
            console.log("Received local file path:", localFilePath)
    
            const cloudinary_response = await uploadOnCloudinary(localFilePath);
    
            console.log("Cloudinary response:", cloudinary_response.url)
    
            // Remove the file after upload
            // await fs.unlink(localFilePath);
    
            if (cloudinary_response) {
              imageUrl = cloudinary_response.url;
            }
          } catch (err) {
            console.error("File not found or cannot be accessed:", localFilePath);
          }
        }
          else {
            console.error('No file uploaded or file path is missing.');
          }
      




    const {
      verified,
      step,
      registered,
        fullName, dateOfBirth, gender,
      // hobbies: {
        nature,
        dietaryPreferences,
        workStyle,
        workHours,
        smokingPreference,
        guestPolicy,
        regionalBackground,
        interests,
      // },
     locationPreferences, nonVegPreference, lease,
      bio, monthlyRentPreferences,
      // image
    } = req.body
    console.log(req.body)

    user.userDetails = {
      fullName,
      dateOfBirth,
      gender,
    }

    user.metaDat = {
      image: imageUrl,
      bio:bio,
      monthlyRent: monthlyRentPreferences,
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
