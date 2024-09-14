import { AuthContext } from './contexts/authContext'
import { useContext, useEffect, useState } from 'react'
import Home from './containers/Home'
import Landing from './containers/Landing'
import Loading from './components/Loading'

const Parent = () => {
  const [loading, setLoading] = useState(true)
  const { authenticated, setAuthenticated } = useContext(AuthContext)
  useEffect(() => {}, [])
  useEffect(() => {
    setLoading(false)
  }, [authenticated])
  if (loading || authenticated === null) return <Loading />
  return authenticated ? <Home /> : <Landing />
}

export default Parent