'use client'

import { AuthContext } from '@/contexts/authContext'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'

const page = () => {
  const { authenticated } = useContext(AuthContext)
  const router = useRouter()
  useEffect(() => {
    if (!authenticated) router.replace('/')
  }, [])
  return <div>We're home!!</div>
}

export default page
