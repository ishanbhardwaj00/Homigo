import { createContext, useState } from 'react'

export const ChatContext = createContext({
  chats: [],
  setChats: (arr) => {},
})

export default ({ children }) => {
  const [chats, setChats] = useState([])
  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  )
}
