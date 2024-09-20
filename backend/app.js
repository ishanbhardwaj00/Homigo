import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose, { mongo } from 'mongoose'
import axios from 'axios'
import http from 'http'
import { createSocketServer } from './sockets/socket.js'
import Chat from './models/chat.model.js'

// Middleware
const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())

// Routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import otpRoutes from './routes/otp.routes.js'
import verifyJwt from './middleware/verifyJwt.js'
import User from './models/users.model.js'

// Use routes
app.use('/api/users', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/users', otpRoutes)

app.get('/', (req, res) => {
  res.send('Work in progress')
})

// Get all users (requires authentication)
app.get('/users', verifyJwt, async (req, res) => {
  const users = await User.find({})
  return res.json({
    success: true,
    users,
  })
})

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 3000

app.get('/chats', verifyJwt, async (req, res) => {
  // console.log(req.decodedToken)
  const userId = new mongoose.Types.ObjectId(req.decodedToken._id)
  console.log(userId)

  const userChats = await Chat.find({
    recipients: { $all: [userId] },
  })
    .populate('messages')
    .populate({ path: 'recipients', select: { metaDat: 1, userDetails: 1 } })
  console.log(userChats)

  const formattedChats = userChats.map((chat) => {
    return {
      ...chat._doc, // Spread the rest of the chat document
      recipients: chat.recipients.filter((recipient) => {
        console.log(recipient._id.toString())
        console.log(userId.toString())

        return recipient._id.toString() !== userId.toString() // Exclude current user's ID
      }), // Exclude current user's ID
    }
  })

  console.log(formattedChats)
  res.json({ success: true, chats: formattedChats })
})

const server = http.createServer(app)
createSocketServer(server)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
