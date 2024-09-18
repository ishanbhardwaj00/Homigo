'use client'
import axios from 'axios'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
type AuthType = {
  user: any
  authenticated: boolean | null
  setUser: Dispatch<SetStateAction<any>>
  setAuthenticated: Dispatch<SetStateAction<boolean>>
}
export const AuthContext = createContext<AuthType>({
  user: null,
  authenticated: null,
  setUser: () => {},
  setAuthenticated: () => {},
})

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuth() {
      const response = await axios.get(
        'http://localhost:5000/api/users/checkAuth',
        { withCredentials: true }
      )

      const { success, profileCompleted, message } = response.data
      if (success && profileCompleted === false) {
        return navigate('/register?profileCompleted=false')
      }
      setAuthenticated(success)
    }
    checkAuth()
  }, [])
  useEffect(() => {}, [authenticated])

  return (
    <AuthContext.Provider
      value={{ user, authenticated, setUser, setAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}
