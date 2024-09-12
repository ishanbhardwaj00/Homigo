'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '@/contexts/authContext'
import { FaArrowLeft } from 'react-icons/fa'
import { BarLoader } from 'react-spinners'
import Loading from '@/components/Loading'
import { poppins } from '@/font/poppins'
import ErrorMessage from '@/components/ErrorMessage'
import { GoArrowLeft } from 'react-icons/go'
import axios from 'axios'

export default ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setValue('image', reader.result)
        setImage(reader.result)
      }
      reader.readAsDataURL(file) // Converts the file to a Base64-encoded string
    }
  }
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AuthContext)
  const [userInformation, setUserInformation] = useState({})

  useEffect(() => {
    setLoading(true)
    const userInformationJson = localStorage.getItem('userInformation')
    if (userInformationJson) {
      setUserInformation(JSON.parse(userInformationJson))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (userInformation?.additionalInfo) {
      setLoading(true)
      reset({
        image: userInformation?.additionalInfo?.image,
        bio: userInformation?.additionalInfo?.bio,
        monthlyRentPreferences:
          userInformation?.additionalInfo?.monthlyRentPreferences,
      })
      setImage(userInformation?.additionalInfo?.image)
      setLoading(false)
    }
  }, [userInformation])

  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState()
  const router = useRouter()

  if (loading) return <Loading />
  return (
    <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
      <div className="w-3/4  py-8 flex flex-col justify-between gap-12">
        <button onClick={() => setStep((step) => step - 1)}>
          <GoArrowLeft size={24} />
        </button>
        <div className="flex flex-col gap-2">
          <div
            className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
          >
            <span>We're Almost</span>
            <span>There</span>
          </div>
          <p className="text-primary font-light">
            Let's put the final piece in place!
          </p>
        </div>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(async (data) => {
            const additionalInfo = { ...data, image: image }
            data = { ...userInformation, additionalInfo }
            try {
              const response = await axios.patch(
                'http://localhost:5000/api/users/signup',
                data,
                { withCredentials: true }
              )
              console.log(response.data)
              setUserInformation(data)
              localStorage.removeItem('userInformation')
              setUser(userInformation)
              setAuthenticated(true)
              router.replace('/')
            } catch (error) {
              console.log(error)
            }
          })}
        >
          <div className="avatar-container self-center">
            <input
              {...register('image')}
              type="file"
              accept="image/*"
              id="file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-input"
              className="avatar-label border-primary border"
            >
              {image ? (
                <img
                  src={getValues('image')}
                  alt="Avatar"
                  className="avatar-image"
                />
              ) : (
                <div className="flex avatar-placeholder text-sm">
                  <span className="text-3xl font-bold">+</span>
                  <span className="text-wrap text-center">
                    Upload Your Profile Picture
                  </span>
                </div>
              )}
            </label>
          </div>
          {errors.image && (
            <ErrorMessage text={errors.image.message!.toString()} />
          )}

          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-button-radio-button ml-2">
              Bio*
            </p>
            <div className="flex justify-center items-center">
              <textarea
                {...register('bio', { required: 'This field is required' })}
                className="w-full h-36 border rounded-2xl p-3 text-base border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Tell us about you – your vibe, your quirks, and what makes you a great roommate!"
              />
            </div>
            {errors.bio && (
              <ErrorMessage text={errors.bio.message!.toString()} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-button-radio-button ml-2">
              Monthly Rent Preferences*
            </p>
            <div className="flex">
              <input
                {...register('monthlyRentPreferences', {
                  required: 'This field is required',
                  validate: (data) => {
                    return !isNaN(data) || 'Should be a number'
                  },
                })}
                className="w-full border rounded-3xl py-3 px-4 text-base border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Enter A Number"
              />
            </div>
            {errors.monthlyRentPreferences && (
              <ErrorMessage
                text={errors.monthlyRentPreferences.message!.toString()}
              />
            )}
          </div>
          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-8">
            Start Matching
          </button>
        </form>
      </div>
    </div>
  )
}
