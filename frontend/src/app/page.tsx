'use client'

import { AuthContext } from '@/contexts/authContext'
import { Poppins } from 'next/font/google'
import { useContext, useEffect, useState } from 'react'
import Home from '../containers/Home'
import Landing from '../containers/Landing'
import axios from 'axios'
import Loading from '@/components/Loading'

const page = () => {
  const [loading, setLoading] = useState(true)
  const { authenticated, setAuthenticated } = useContext(AuthContext)
  useEffect(() => {
    async function checkAuth() {
      const response = await axios.get(
        'http://localhost:5000/api/users/checkAuth',
        { withCredentials: true }
      )

      const { success, message } = response.data

      console.log(message)
      setAuthenticated(success)
    }
    checkAuth()
    setLoading(false)
  }, [])
  useEffect(() => {}, [authenticated])
  if (loading) return <Loading />
  return authenticated ? <Home /> : <Landing />
}

export default page
