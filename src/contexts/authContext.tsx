'use client'
import { createContext, Dispatch, SetStateAction, useState } from 'react'

type AuthType = {
  user: any
  authenticated: boolean
  setUser: Dispatch<SetStateAction<any>>
  setAuthenticated: Dispatch<SetStateAction<boolean>>
}
export const AuthContext = createContext<AuthType>({
  user: null,
  authenticated: false,
  setUser: () => {},
  setAuthenticated: () => {},
})

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <AuthContext.Provider
      value={{ user, authenticated, setUser, setAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}
