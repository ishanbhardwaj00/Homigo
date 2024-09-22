import axios from 'axios'
import { createContext, ReactNode, useEffect, useState } from 'react'
import Loading from '../components/Loading'

export const MatchContext = createContext({
  matches: [],
  index: 0,
  setIndex: (index: number) => {},
})

export default ({ children }: { children: ReactNode }) => {
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
        const usersMap = {}
        if (success) {
          users.forEach((user) => {
            usersMap[user._id] = user
          })

          console.log(usersMap)
        }
        setMatches(usersMap)
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
    // Call the async function inside useEffect
  }, [])

  return (
    <MatchContext.Provider value={{ matches, index, setIndex }}>
      {children}
    </MatchContext.Provider>
  )
}
