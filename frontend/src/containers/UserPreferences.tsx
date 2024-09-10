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

const locations = [
  'Near Cyberhub',
  'Near Unitech CyberPark',
  'Near Golf Course Ext',
  'Near Millenium City Centre',
  'Near Old Gurgaon',
  'Near IMT Manesar',
  'Near Phase II',
]
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

  useEffect(() => {
    if (userInformation?.preferences) {
      setLoading(true)
      reset({
        locationPreferences: userInformation?.preferences.locationPreferences,
        nonVegPreference: userInformation?.preferences.nonVegPreference,
        lease: userInformation?.preferences.lease,
      })
      setLoading(false)
    }
  }, [userInformation])

  const [loading, setLoading] = useState(false)

  if (loading) return <Loading />
  return (
    <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
      <div className="w-3/4  my-16 flex flex-col justify-between gap-14">
        <button onClick={() => setStep((step) => step - 1)}>
          <GoArrowLeft size={24} />
        </button>
        <div className="flex flex-col gap-2">
          <div
            className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
          >
            <span>What are your</span>
            <span>Roommate</span>
            <span>Preferences?</span>
          </div>
        </div>
        <form
          className="flex flex-col gap-7"
          onSubmit={handleSubmit((preferences) => {
            setStep((step) => step + 1)
            setUserInformation({ ...userInformation, preferences })

            localStorage.setItem(
              'userInformation',
              JSON.stringify({ ...userInformation, preferences, step: 5 })
            )
            console.log(preferences)
          })}
        >
          <div className="flex flex-col text-button-radio-button font-semibold gap-2">
            <span>
              <p className="text-sm">Where Would You Prefer To Stay?</p>
              <p className="text-xs font-thin text-button-radio-button"></p>
            </span>
            <div className="flex flex-col">
              {locations.map((location, index) => (
                <label
                  className="flex justify-start py-1 items-center gap-4"
                  key={index}
                  htmlFor={location}
                >
                  <input
                    type="checkbox"
                    value={location}
                    // className="appearance-none bg-transparent border border-solid border-gray-300 w-4 h-4 checked:border-primary"
                    className=" bg-transparent border border-solid border-gray-300 w-4 h-4 checked:border-primary"
                    id={location}
                    {...register('locationPreferences', {
                      required: 'This field is required',
                    })}
                  />
                  <div className="flex flex-col w-full gap-2">
                    <span className="text-sm align-center font-normal w-max">
                      {location}
                    </span>
                    <div className="w-full h-px bg-gray-300 "></div>
                  </div>
                </label>
              ))}
              {errors.locationPreferences && (
                <ErrorMessage
                  text={errors.locationPreferences.message!.toString()}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col text-button-radio-button font-semibold gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm">
                Are you comfortable living with someone who consumes
                non-vegetarian food?
              </p>
              <p className="text-xs font-thin text-button-radio-button"></p>
              <div className="flex gap-2 flex-wrap ">
                {[
                  'Yes, I’m comfortable with it',
                  'No, I prefer a vegetarian-only environment',
                ].map((option, index) => (
                  <label
                    key={option}
                    className="flex text-sm items-center font-normal py-2 px-3 border-solid border border-black rounded-full has-[:checked]:bg-button-primary has-[:checked]:border-button-primary"
                    htmlFor={option}
                  >
                    <span className="w-max">{option}</span>
                    <input
                      className="hidden"
                      type="radio"
                      value={option}
                      name="nonVegPreference"
                      id={option}
                      {...register(`nonVegPreference`, {
                        required: 'This field is required',
                      })}
                    />
                  </label>
                ))}
                {errors.nonVegPreference && (
                  <ErrorMessage
                    text={errors.nonVegPreference.message!.toString()}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col text-button-radio-button font-semibold gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm">What is your preferred lease duration?</p>
              <p className="text-xs font-thin text-button-radio-button"></p>
              <div className="flex gap-1 flex-wrap ">
                {['No lease', '3 months', '6 months', '12 months'].map(
                  (option, index) => (
                    <label
                      key={option}
                      className="flex text-sm items-center font-normal py-2 px-3 border-solid border border-black rounded-full has-[:checked]:bg-button-primary has-[:checked]:border-button-primary"
                      htmlFor={option}
                    >
                      <span className="w-max">{option}</span>
                      <input
                        {...register(`lease`, {
                          required: 'This field is required',
                        })}
                        className="hidden"
                        type="radio"
                        value={option}
                        name="lease"
                        id={option}
                      />
                    </label>
                  )
                )}
              </div>
              {errors.lease && (
                <ErrorMessage text={errors.lease.message!.toString()} />
              )}
            </div>
          </div>
          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-8">
            Next
          </button>
        </form>
      </div>
    </div>
  )
}