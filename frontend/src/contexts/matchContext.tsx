import axios from 'axios'
import { createContext, ReactNode, useEffect, useState } from 'react'
import Loading from '../components/Loading'

export const MatchContext = createContext({
  matches: {},
  setMatches: (obj: any) => {},
  index: 0,
  setIndex: (index: number) => {},
})

export default ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState(null)
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users', {
          withCredentials: true,
        })

        console.log(response.data)
        const { success, users } = response.data

        setMatches(users)
        console.log(users)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
    // Call the async function inside useEffect
  }, [])

  return (
    <MatchContext.Provider value={{ matches, setMatches, index, setIndex }}>
      {children}
    </MatchContext.Provider>
  )
}
