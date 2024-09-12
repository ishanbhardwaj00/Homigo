import ErrorMessage from '@/components/ErrorMessage'
import Loading from '@/components/Loading'
import { poppins } from '@/font/poppins'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { GoArrowLeft } from 'react-icons/go'
import { BarLoader } from 'react-spinners'

const VerifyOtp = ({ userCredentials, setStep }) => {
  useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, [])
  const {
    getValues,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm()

  const [loading, setLoading] = useState(false)
  const [userInformation, setUserInformation] = useState({})

  useEffect(() => {
    setLoading(true)
    const userInformationJson = localStorage.getItem('userInformation')
    if (userInformationJson) {
      setUserInformation(JSON.parse(userInformationJson))
    }
    setLoading(false)
  }, [])
  if (loading) return <Loading />

  return (
    <div className="flex flex-col items-center bg-step1 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom animateRegistration ">
      <div className="w-3/4 flex flex-col justify-start mt-10 gap-16">
        <button onClick={() => setStep((step) => step - 1)}>
          <GoArrowLeft size={24} />
        </button>
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>We've</span>
          <span>Sent You</span>
          <span>A Code</span>
          {/* <span>Aadhar</span> */}
        </div>
        <div className={`flex flex-col ${poppins.className} gap-7`}>
          <form
            autoComplete="off"
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(async (data) => {
              console.log(data)
              setLoading(true)
              localStorage.setItem(
                'userInformation',
                JSON.stringify({ ...userInformation, verified: true, step: 3 })
              )
              const response = await axios.post(
                'http://localhost:5000/api/users/signup',
                userCredentials,
                { withCredentials: true }
              )

              setStep((step: number) => step + 1)
              setTimeout(() => {}, 300)
              setLoading(false)
            })}
          >
            <span className={`${poppins.className} ml-3 text-sm font-medium`}>
              6 Digit OTP*
            </span>
            <input
              {...register('otp', {
                required: 'This field is required',
              })}
              className="w-full outline-1 outline py-4 px-5 outline-black rounded-full focus:outline-2"
              type="text"
              placeholder="Enter your OTP here"
            />
            {errors.otp && (
              <ErrorMessage text={errors.otp.message!.toString()} />
            )}
            <button
              disabled={loading}
              className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
            >
              {loading ? <BarLoader /> : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp
