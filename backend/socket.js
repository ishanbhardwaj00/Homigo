import { parse } from 'dotenv'
import { WebSocketServer } from 'ws'
import cookie from 'cookie'
import jwt, { decode } from 'jsonwebtoken'
import mongoose from 'mongoose'

import Message from './models/message.model.js'
import Chat from './models/chat.model.js'

const UserToSocketMap = new Map()
const SocketToUserMap = new Map()

export function createSocketServer(server) {
  const wss = new WebSocketServer({ server: server })

  wss.on('connection', (ws, request) => {
    const cookies = cookie.parse(request.headers.cookie || '')

    const decodedToken = jwt.verify(
      cookies.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    )

    if (!decodedToken) {
      console.log('invalid token')
      return
    }
    console.log('connected user')

    UserToSocketMap.set(decodedToken._id, ws)
    SocketToUserMap.set(ws, decodedToken._id)

    ws.on('message', async function message(data) {
      try {
        data = JSON.parse(data.toString())

        const parsedData = JSON.parse(data.jsonMessage)
        console.log(parsedData)

        const receiverSocket = UserToSocketMap.get(parsedData.receiver)
        console.log('receiverf sickert ', typeof receiverSocket)
        console.log(receiverSocket)

        console.log(`sending ${parsedData.content} to ${receiverSocket}`)

        const sender = SocketToUserMap.get(ws)
        if (receiverSocket) {
          const message = { content: parsedData.content, sender: sender }
          receiverSocket.send(JSON.stringify(message), { binary: false })
        }
        const senderObjectId = new mongoose.Types.ObjectId(sender)
        const receiverObjectId = new mongoose.Types.ObjectId(
          parsedData.receiver
        )

        const message = new Message({
          sender: senderObjectId,
          content: parsedData.content,
        })
        message.save()

        const chat = await Chat.findOne({
          recipients: {
            $all: [senderObjectId, receiverObjectId],
          },
        })

        console.log(chat)

        if (!chat) {
          console.log('creating new chat')

          const newChat = new Chat({
            recipients: [senderObjectId, receiverObjectId],
            isGroupChat: false,
            messages: [message],
          })

          newChat.save()
        } else {
          const message = new Message({
            sender: senderObjectId,
            content: parsedData.content,
          })
          message.save()
          chat.messages = [...chat.messages, message]
          chat.save()
        }
      } catch (error) {
        console.log('lol check request', error)
      }
    })
  })
}
