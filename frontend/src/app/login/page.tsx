'use client'
import { Poppins } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useState, useRef, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { passwordStrength } from 'check-password-strength'
import { AuthContext } from '@/contexts/authContext'
import Loading from '@/components/Loading'
import { poppins } from '@/font/poppins'
import ErrorMessage from '@/components/ErrorMessage'
import axios from "axios"

export default ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
  const [userInformation, setUserInformation] = useState({})
  const [loginError, setLoginError] = useState(null)
  const {setAuthenticated} = useContext(AuthContext)
  useEffect(() => {
    setLoading(true)
    const userInformationJson = localStorage.getItem('userInformation')

    if (userInformationJson) {
      setUserInformation(JSON.parse(userInformationJson))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
  }, [userInformation])

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (loading) return <Loading />
  return (
    <div className="flex flex-col items-center bg-step2 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom bg-auto animateRegistration">
      <div className="w-3/4 flex flex-col justify-start mt-16 gap-24">
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>Log In</span>
          <span>And Find </span>
          <span>The Perfect Roommate</span>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
          
            const response  = await axios.post("http://localhost:5000/api/users/login", data);
            console.log(response.data); 
            
            const {success, message, id} = response.data; 

            if(success) {
              setAuthenticated(true);
              router.replace('/home')

            }
            else {
              setLoginError(message);
            }
          })}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <input
                className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                })}
                placeholder="Email Address"
              />
              {errors.email && <ErrorMessage text={errors.email.message} />}
            </div>
            <div className="flex flex-col gap-1 ">
              <input
                className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
                type="password"
                {...register('password', {
                  required: 'password is required',
                  minLength: {
                    value: 10,
                    message: 'Password should be at least 10 characters',
                  },
                  validate: (data) => {
                    return (
                      !(passwordStrength(data).id < 1) ||
                      'Password is too weak. Add numbers and special characters to it.'
                    )
                  },
                })}
                placeholder="Password"
              />
              {errors.password && (
                <ErrorMessage text={errors.password.message!.toString()} />
              )}
            </div>
            {loginError && <ErrorMessage text={loginError}/>}
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
