'use client'
import { useRouter } from 'next/navigation'
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

const page = () => {
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AuthContext)
  const router = useRouter()
  const [step, setStep] = useState<number>(3)
  const [userInformation, setUserInformation] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        if (authenticated) {
          return router.replace('/')
        }
        const userInformationJson = localStorage.getItem('userInformation')
        if (userInformationJson) {
          const parsedInfo = JSON.parse(userInformationJson)
          setUserInformation(parsedInfo)
          setStep(parsedInfo?.step ?? 3)
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
    if (authenticated) {
      router.replace('/')
    }
  }, [authenticated])

  if (loading) return <Loading />
  else if (step === 1) return <AadharVerify setStep={setStep} />
  else if (step === 2) return <UserSignUp setStep={setStep} />
  else if (step === 3) return <VerifyOtp setStep={setStep} />
  else if (step === 4) return <UserDetails setStep={setStep} />
  else if (step === 5) return <UserDetailsCont setStep={setStep} />
  else if (step === 6) return <UserPreferences setStep={setStep} />
  else if (step === 7) return <ProfileCompletion setStep={setStep} />
}

export default page
