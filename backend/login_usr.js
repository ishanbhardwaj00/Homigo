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
  
      // Return tokens to the client
      res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });