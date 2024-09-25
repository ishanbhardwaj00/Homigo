import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

// Create Context
export const StaysContext = createContext()

// Create Provider Component
export default ({ children }) => {
  const [stays, setStays] = useState({})

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stays')
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
    fetchStays()
  }, [])

  return (
    <StaysContext.Provider value={{ stays }}>{children}</StaysContext.Provider>
  )
}
