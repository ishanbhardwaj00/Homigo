import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const ChatContext = createContext({
  chats: new Map(),
  setChats: (arr) => {},
})

export default ({ children }) => {
  useEffect(() => {
    async function getUserChats() {
      try {
        const response = await axios.get('http://localhost:5000/chats', {
          withCredentials: true,
        })

        const { success, chats } = response.data

        if (success) {
          setChats((prevChats) => {
            const map = {}

            for (let chat of chats) {
              map[chat?.recipients[0]?._id] = chat
            }

            return map
          })
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
  useEffect(() => {}, [chats])
  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  )
}
