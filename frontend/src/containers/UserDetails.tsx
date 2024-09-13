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

export default ({ setStep }: { setStep: any }) => {
  const [userInformation, setUserInformation] = useState({})
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    setLoading(true)
    const userInformationJson = localStorage.getItem('userInformation')
    if (userInformationJson) {
      setUserInformation(JSON.parse(userInformationJson))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (userInformation?.userDetails) {
      // Reset the form only after userInformation is updated
      reset({
        fullName: userInformation?.userDetails?.fullName || '',
        dateOfBirth: userInformation?.userDetails?.dateOfBirth || '',
        pinCode: userInformation?.userDetails?.pinCode || '',
        gender: userInformation?.userDetails?.gender || '',
      })
    }
  }, [userInformation])

  console.log(userInformation)

  if (loading) return <Loading />
  return (
    <div className="flex flex-col items-center justify-center h-screen max-h-screen bg-bottom animateRegistration">
      <div className="w-3/4  flex flex-col justify-between gap-16">
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>Quick Intro!</span>
          <span>Who's Moving </span>
          <span>In?</span>
        </div>
        <form
          onSubmit={handleSubmit((userDetails) => {
            console.log(userDetails)
            setUserInformation({ ...userInformation, userDetails })
            localStorage.setItem(
              'userInformation',
              JSON.stringify({ ...userInformation, userDetails, step: 3 })
            )
            setStep((step: number) => step + 1)
          })}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <p className="text-black font-bold ml-2">Your Full Name*</p>
            <input
              className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
              type="text"
              {...register('fullName', {
                required: 'This field is required',
              })}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <ErrorMessage text={errors.fullName.message!.toString()} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-black font-bold ml-2">Your Birth Date*</p>
            <input
              className="w-full outline-1 outline p-4 text-black outline-black rounded-full focus:outline-1"
              type="date"
              {...register('dateOfBirth', {
                required: 'Date is required',
              })}
            />
            {errors.dateOfBirth && (
              <ErrorMessage text={errors.dateOfBirth.message!.toString()} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-black font-bold ml-2">Your Pincode*</p>
            <input
              className="w-full outline-1 outline p-4 text-black outline-black rounded-full focus:outline-1"
              type="text"
              placeholder="110065"
              {...register('pinCode', {
                required: 'Date is required',
                valueAsNumber: true,
              })}
            />
            {errors.pinCode && (
              <ErrorMessage text={errors.pinCode.message!.toString()} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-black font-bold ml-2">What's your gender?</p>
            <div className="flex flex-col gap-1">
              {['Male', 'Female', 'Other'].map((gender) => (
                <label
                  key={gender}
                  htmlFor={gender}
                  className="flex p-4 bg-button-radio w-full justify-between rounded-full text-button-radio-button"
                >
                  <span>{gender}</span>
                  <input
                    className="rounded-full w-5 h-5 outline-none border-primary"
                    {...register('gender', {
                      required: 'This field is required',
                    })}
                    type="radio"
                    name="gender"
                    value={gender}
                    id={gender}
                  />
                </label>
              ))}
              {errors.gender && (
                <ErrorMessage text={errors.gender?.message!.toString()} />
              )}
            </div>
          </div>
          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-4">
            Next
          </button>
        </form>
      </div>
    </div>
  )
}
