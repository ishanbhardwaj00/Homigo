import axios from 'axios'
import { createContext, ReactNode, useEffect, useState } from 'react'
import Loading from '../components/Loading'

export const MatchContext = createContext({
  matches: [],
  index: 0,
  setIndex: (index: number) => {},
})

export default ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users', {
          withCredentials: true,
        })
        setMatches(response.data.users)
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
    setLoading(false) // Call the async function inside useEffect
  }, [])
  if (loading) return <Loading />
  return (
    <MatchContext.Provider value={{ matches, index, setIndex }}>
      {children}
    </MatchContext.Provider>
  )
}
