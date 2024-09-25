import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose, { mongo } from 'mongoose'
import axios from 'axios'
import http from 'http'
import { createSocketServer } from './sockets/socket.js'
import Chat from './models/chat.model.js'
import jwt from 'jsonwebtoken'

// Middleware
const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())

// Routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import otpRoutes from './routes/otp.routes.js'
import location from './routes/location.routes.js'
import verifyJwt from './middleware/verifyJwt.js'
import User from './models/users.model.js'

// Use routes
app.use('/api/users', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/users', otpRoutes)
app.use('/api/users', location)

app.get('/users/:id', verifyJwt, async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id)
  console.log(user)
  const { userCred, ...userObject } = { ...user }
  return res.json({
    success: true,
    user: userObject,
  })
})

// app.put('/api/users/:id', verifyJwt, async (req, res) => {
//   const id = req.params.id;
//   const updateData = req.body;  // The updated fields sent in the request body

//   try {
//     // Ensure that only the logged-in user can update their own details
//     if (req.decodedToken._id !== id) {
//       return res.status(403).json({ success: false, message: "Unauthorized to update this user." });
//     }

//     // Ensure that password is hashed if it's being updated
//     if (updateData.userCred && updateData.userCred.password) {
//       const salt = await bcrypt.genSalt(10);
//       updateData.userCred.password = await bcrypt.hash(updateData.userCred.password, salt);
//     }

//     // Find the user by ID and update the relevant fields
//     const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     return res.json({
//       success: true,
//       message: "User details updated successfully.",
//       user: updatedUser,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Error updating user details", error: error.message });
//   }
// });

app.get('/users', verifyJwt, async (req, res) => {

  // console.log(await User.find({}))
  try {
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);

    // Retrieve the JWT token from the request headers or cookies
    const token = req.decodedToken //|| req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Decode the JWT to get the user information
    // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const userEmail = req.decodedToken.email;
    console.log("Extracted email from token", userEmail)

    // Send POST request to Flask app with the user's email
    const response = await axios.post('http://localhost:8080/nn', {
      email: userEmail
    });

    // Assuming Flask responds with a 'users' object
    const users = response.data

    console.log("Users: ", users)

    // Process the users and strip out sensitive information
    const usersObject = users.reduce((acc, user) => {
      const { userCred, ...rest } = user;
      acc[user._id] = rest;
      return acc;
    }, {});

    // console.log(JSON.parse(usersObject))
    // Return the processed users to the client
    return res.json({
      success: true,
      users: usersObject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users or decode token',
      error: error.message,
    });
  }
});

app.post('/cnn', async (req, res) => {
  try {
    // Sending a POST request to Flask app
    const response = await axios.post('http://localhost:8080/nn', {
      email: 'parthtayal2001@gmail.com'
    });

    // Return the response from Flask to the client
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error sending data to Flask' });
  }
});
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 3000

app.get('/chats', verifyJwt, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.decodedToken._id)

  const userChats = await Chat.find({
    recipients: { $all: [userId] },
  })
    .populate('messages')
    .populate({ path: 'recipients', select: { metaDat: 1, userDetails: 1 } })
    .populate('lastMessage')

  const formattedChats = userChats.map((chat) => {
    return {
      ...chat._doc,
      recipients: chat.recipients.filter((recipient) => {
        return recipient._id.toString() !== userId.toString()
      }),
    }
  })
  const chats = {}
  formattedChats.forEach((chat) => {
    chats[chat?.recipients[0]?._id] = chat
  })

  res.json({ success: true, chats })
})

app.post('/api/chats/read', verifyJwt, async (req, res) => {
  console.log('wil mark chat as read')

  const sender = req.decodedToken._id
  const receiver = req.body.receiver

  const userChat = await Chat.findOne({
    recipients: { $all: [sender, receiver] },
  }).populate('lastMessage')

  if (userChat.lastMessage) {
    if (!userChat.lastMessage.readBy.includes(sender)) {
      userChat.lastMessage.readBy.push(sender)
      await userChat.lastMessage.save()
      console.log('Sender added to readBy:', userChat.lastMessage.readBy)
    } else {
      console.log('Sender already in readBy')
    }
  } else {
    console.log('lastMessage is not defined')
  }
  userChat.save()
  return res.json({ success: true, message: 'marked message as read' })
})
const server = http.createServer(app)
createSocketServer(server)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
