import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'

export const ChatContext = createContext(null)

export default ({ children }) => {
  useEffect(() => {
    async function getUserChats() {
      try {
        const response = await axios.get('http://localhost:5000/chats', {
          withCredentials: true,
        })

        const { success, chats } = response.data
        console.log(response)

        console.log('chats', chats)

        if (success) {
          const map = {}

          for (let chat of chats) {
            map[chat?.recipients[0]?._id] = chat

            console.log(map)
          }

          setChats(map)
        } else {
          console.log('no chats found')
        }
      } catch (error) {
        console.log(error)
      }
    }

    getUserChats()
  }, [])
  const [chats, setChats] = useState({})
  // const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
  //   'http://localhost:5000'
  // )

  // useEffect(() => {
  //   console.log(lastMessage)
  // }, [lastMessage])
  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  )
}
