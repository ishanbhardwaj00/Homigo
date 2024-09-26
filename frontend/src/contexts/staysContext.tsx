import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from './authContext'

// Create Context
export const StaysContext = createContext()

// Create Provider Component
export default ({ children }) => {
  const [stays, setStays] = useState({})
  const { user } = useContext(AuthContext)
  useEffect(() => {
    const fetchStays = async () => {
      console.log(user, 'STAYS YSER')

      try {
        const response = await axios.post(
          'http://localhost:5000/stays',
          { user },
          {
            withCredentials: true,
          }
        )
        console.log(response.data.stays)
        const staysMap = {}

        const arr = response.data.stays

        arr.forEach((el) => {
          staysMap[el._id] = el
        })
        setStays(staysMap)
        console.log(staysMap)
      } catch (error) {
        console.error('Error fetching stays:', error)
      }
    }
    if (user) fetchStays()
  }, [user])

  return (
    <StaysContext.Provider value={{ stays }}>{children}</StaysContext.Provider>
  )
}
