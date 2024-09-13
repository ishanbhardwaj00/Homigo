'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

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
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const response = await axios.get(
        'http://localhost:5000/api/users/checkAuth',
        { withCredentials: true }
      )

      const { success, profileCompleted, message } = response.data
      if (success && profileCompleted === false) {
        return router.replace('/register?profileCompleted=false')
      }
      console.log(message)
      setAuthenticated(success)
    }
    checkAuth()
  }, [])
  return (
    <AuthContext.Provider
      value={{ user, authenticated, setUser, setAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}
