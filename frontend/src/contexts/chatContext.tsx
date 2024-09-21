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

  const [chats, setChats] = useState(null)
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    'http://localhost:5000'
  )

  useEffect(() => {
    if (lastMessage) {
      console.log(chats) // Logging chats to inspect

      const { content, sender } = JSON.parse(lastMessage?.data)

      setChats((prevChats) => {
        console.log(prevChats)

        if (prevChats[sender]) {
          console.log(sender, prevChats)

          // Update the existing sender's messages
          return {
            ...prevChats,
            [sender]: {
              ...prevChats[sender],
              messages: [...prevChats[sender].messages, { sender, content }],
              lastMessage: { sender, content, readBy: [] },
            },
          }
        } else {
          console.log('First time for this sender')

          // Add new sender and their first message
          return {
            ...prevChats,
            [sender]: {
              messages: [{ sender, content }],
              lastMessage: { sender, content, readBy: [] },
            },
          }
        }
      })
    }
  }, [lastMessage])
  useEffect(() => {
    console.log(chats)
  }, [chats])
  return (
    <ChatContext.Provider
      value={{ chats, setChats, sendJsonMessage, lastMessage, readyState }}
    >
      {children}
    </ChatContext.Provider>
  )
}
