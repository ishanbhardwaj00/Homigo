'use client'
import { Poppins } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useState, useRef, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AadharValidator from 'aadhaar-validator'
import { passwordStrength } from 'check-password-strength'
import { AuthContext } from '@/contexts/authContext'
import { userDetailsSchema } from '@/schemas/zUserInfo'
import { TUser, TUserDetails } from '@/schemas/tUserInfo'
import { FaArrowLeft } from 'react-icons/fa'
import { BarLoader } from 'react-spinners'
import Loading from '@/components/Loading'
import { poppins } from '@/font/poppins'
import ErrorMessage from '@/components/ErrorMessage'
import { GoArrowLeft } from 'react-icons/go'
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

  useEffect(() => {
    setLoading(true)
    const userInformationJson = localStorage.getItem('userInformation')

    if (userInformationJson) {
      setUserInformation(JSON.parse(userInformationJson))
    }
    setLoading(false)
  }, [])

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (loading) return <Loading />
  return (
    <div className="flex flex-col items-center bg-step2 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom bg-auto animateRegistration">
      <div className="w-3/4 flex flex-col justify-start mt-10 gap-24">
        <button onClick={() => setStep((step) => step - 1)}>
          <GoArrowLeft size={24} />
        </button>
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>Secure Your </span>
          <span>Access &</span>
          <span>Login Anytime!</span>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            const response  = await axios.post("http://locahost:5000/api/users/signup", data);
            console.log(response.data)

            localStorage.setItem(
              'userInformation',
              JSON.stringify({ ...userInformation, registered: true, step: 2 })
            )
            // setStep((step: number) => step + 1)
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
                value="ishan.x.bhardwaj@gmail.com"
                placeholder="Email Address"
              />
              {errors.email && <ErrorMessage text={errors.email.message} />}
            </div>
            <div className="flex flex-col gap-1 ">
              <input
                className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
                type="password"
                value="Testing123"
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
            <div className="flex flex-col gap-1">
              <input
                className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
                type="password"
                value="Testing123"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) =>
                    value === getValues('password') || 'Passwords must match',
                })}
                placeholder="Password"
              />
              {errors.confirmPassword && (
                <ErrorMessage
                  text={errors.confirmPassword.message!.toString()}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label
                className="flex flex-row items-center w-5/6 self-center gap-2"
                htmlFor="tc"
              >
                <input
                  {...register('tc', {
                    required:
                      'Please confirm you have read and understood the Terms & Conditions and Privacy policy',
                  })}
                  type="checkbox"
                  value="tc"
                  id="tc"
                />
                <span className="italic  text-xs">
                  I agree to Homigo’s Terms & Conditions and Privacy Policy
                </span>
              </label>
              {errors.tc && (
                <ErrorMessage text={errors.tc.message!.toString()} />
              )}
            </div>
            <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}