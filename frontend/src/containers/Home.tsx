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
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(1)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users', {
          withCredentials: true,
        })
        setUsers(response.data.users)
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (location.pathname === '/')
      setSelected(1) // Call the async function inside useEffect
    else if (location.pathname === '/profile') setSelected(0) // Call the async function inside useEffect
    if (location.pathname === '/chats') setSelected(2)
  }, [location.pathname])

  useEffect(() => {
    if (!authenticated) navigate('/')
  }, [authenticated])

  if (loading) return <Loading />

  return (
    <div className="flex flex-col h-screen  bg-home-light">
      {/* <Header selected={selected} /> */}
      <Outlet />
      <Navigation setSelected={setSelected} selected={selected} />
    </div>
  )
}
