app.post('/api/users/signup', async (req, res) => {
  console.log(req.body)
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ 'userCred.email': email });
    console.log("user: ", userExists);

    if (userExists) {
      return res.status(409).send({ success: false, message: "User already exists" });
    }

    // Create new user with profileCompleted set to false
    const user = new User({
      profileCompleted: false,
      userCred: { email, password }
    });

    // Save the new user to the database
    await user.save();

    // Generate access and refresh tokens for the new user
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token in the user document
    user.userCred.refreshToken = refreshToken;
    await user.save();

    // Set the tokens as HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
    });

    // Respond with success and user ID
    res.status(201).json({
      success: true,
      id: user._id,
    });

  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({
      message: 'Error saving user data',
      error: err.message,
    });
  }
});
