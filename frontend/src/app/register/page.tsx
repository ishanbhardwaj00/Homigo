'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useContext, useEffect } from 'react'
import { AuthContext } from '@/contexts/authContext'
import Loading from '@/components/Loading'
import AadharVerify from '../../containers/AadharVerify'
import UserSignUp from '../../containers/UserSignUp'
import UserDetails from '../../containers/UserDetails'
import UserDetailsCont from '../../containers/UserDetailsCont'
import UserPreferences from '../../containers/UserPreferences'
import ProfileCompletion from '../../containers/ProfileCompletion'
import VerifyOtp from '@/containers/VerifyOtp'
import { profile } from 'console'

const page = () => {
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AuthContext)
  const router = useRouter()
  const [step, setStep] = useState<number>(1)
  const [userInformation, setUserInformation] = useState({})
  const [loading, setLoading] = useState(true)
  const [userCredentials, setUserCredentials] = useState({})

  const searchParams = useSearchParams()
  const profileCompleted = searchParams.get('profileCompleted')
  console.log(typeof profileCompleted, profileCompleted)

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        if (authenticated) {
          return router.replace('/')
        } else if (profileCompleted === 'false') {
          setStep(4)
        } else {
          setStep(1)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInformation()
  }, [])

  useEffect(() => {
    if (profileCompleted) setStep(4)
  }, [profileCompleted])

  useEffect(() => {
    if (authenticated) {
      router.replace('/')
    }
  }, [authenticated])

  if (loading) return <Loading />
  else if (step === 1) return <AadharVerify setStep={setStep} />
  else if (step === 2)
    return (
      <UserSignUp setUserCredentials={setUserCredentials} setStep={setStep} />
    )
  else if (step === 3)
    return <VerifyOtp userCredentials={userCredentials} setStep={setStep} />
  else if (step === 4) return <UserDetails setStep={setStep} />
  else if (step === 5) return <UserDetailsCont setStep={setStep} />
  else if (step === 6) return <UserPreferences setStep={setStep} />
  else if (step === 7) return <ProfileCompletion setStep={setStep} />
}

export default page
