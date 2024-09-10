'use client'

import Loading from '@/components/Loading'
import Header from '@/components/Header'
import { AuthContext } from '@/contexts/authContext'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Main from './Main'

export default () => {
  const { authenticated } = useContext(AuthContext)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(1)

  useEffect(() => {
    console.log('Home screen')

    setLoading(false)
  }, [])

  useEffect(() => {
    if (!authenticated) router.replace('/')
  }, [authenticated])

  if (loading) return <Loading />

  
  return (
    <div className="flex flex-col h-screen bg-home-light justify-between">
      <Header />
      {selected === 0 ? <div>profile</div> : selected === 1 ?  <Main />: <div>chat</div>}
      <Navigation setSelected={setSelected} selected={selected}/>
    </div>
  )
}
