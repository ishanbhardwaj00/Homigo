'use client'

import { AuthContext } from '@/contexts/authContext'
import { Poppins } from 'next/font/google'
import { useContext, useEffect } from 'react'
import Home from '../containers/Home'
import Landing from '../containers/Landing'

const page = () => {
  const { authenticated } = useContext(AuthContext)
  useEffect(() => {
    console.log('Authenticated:', authenticated)
  }, [authenticated])

  return authenticated ? <Home /> : <Landing />
}

export default page
