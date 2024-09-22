import Loading from '../components/Loading'
import Header from '../components/Header'
import { AuthContext } from '../contexts/authContext'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Main from './Main'
import axios from 'axios'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

export default () => {
  const { authenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = useState(1)

  useEffect(() => {
    if (location.pathname === '/')
      setSelected(1) // Call the async function inside useEffect
    else if (location.pathname === '/profile') setSelected(0) // Call the async function inside useEffect
    if (location.pathname === '/chats') setSelected(2)
  }, [location.pathname])

  useEffect(() => {
    if (!authenticated) navigate('/')
  }, [authenticated])
  return (
    <div className="flex flex-col h-screen bg-home-light">
      {/* <Header selected={selected} /> */}
      <Outlet />
      <Navigation setSelected={setSelected} selected={selected} />
    </div>
  )
}
