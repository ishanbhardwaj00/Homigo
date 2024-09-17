import { parse } from 'dotenv'
import { WebSocketServer } from 'ws'
import cookie from 'cookie'
import jwt, { decode } from 'jsonwebtoken'

const clients = []
const UserToSocketMap = new Map()

export function createSocketServer(server) {
  const wss = new WebSocketServer({ server: server })

  console.log("Server connection")

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
    console.log(decodedToken)
    console.log('connected user')

    UserToSocketMap[decodedToken._id] = ws

    ws.on('message', function message(data) {
      try {
        data = JSON.parse(data.toString())

        const parsedData = JSON.parse(data.jsonMessage)
        console.log(parsedData)

        const receiverSocket = UserToSocketMap[parsedData.receiver]
        console.log(`sending ${parsedData.message} to ${receiverSocket}`)

        if (receiverSocket)
          receiverSocket.send(parsedData.message, { binary: false })
      } catch (error) {
        console.log('lol check request')
      }
    })
  })
}
