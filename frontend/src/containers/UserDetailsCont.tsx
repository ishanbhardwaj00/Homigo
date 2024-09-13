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
const questionnare = [
  {
    id: 'nature',
    heading: 'nature',
    type: 'radio',
    options: ['introvert', 'extrovert', 'ambivert'],
  },
  {
    id: 'dietaryPreferences',
    heading: 'Dietary Preferences',
    type: 'radio',
    options: ['Vegetarian', 'Non-Vegetarian'],
  },
  {
    id: 'workStyle',
    heading: 'Work Style',
    type: 'radio',
    options: ['Works from Home', 'Goes To Office', 'Hybrid Work Setting'],
  },
  {
    id: 'workHours',
    heading: 'Work Hours',
    type: 'radio',
    options: ['Daytime Shift', 'Nighttime Shift'],
  },
  {
    id: 'smokingPreference',
    heading: 'Smoking Preference',
    type: 'radio',
    options: ['Smoker', 'Non-Smoker'],
  },
  {
    id: 'drinkingPreference',
    heading: 'Drinking Preference',
    type: 'radio',
    options: ['Social Drinker', 'Frequent Drinker', 'Teetotaller'],
  },
  {
    id: 'guestPolicy',
    heading: 'Guest Policy',
    type: 'radio',
    options: [
      'Have Guests Over Often',
      'Have Guests Over Occasionally',
      'Have Guests Over Rarely',
    ],
  },
  {
    id: 'regionalBackground',
    heading: 'Regional Background',
    type: 'radio',
    options: [
      'North India',
      'East India',
      'West India',
      'South India',
      'North-East India',
      'Central India',
    ],
  },
  {
    id: 'interests',
    heading: 'Hobbies & Interests',
    type: 'checkbox',
    options: [
      'Books',
      'Movies',
      'Gym',
      'Traveling',
      'Sports',
      'Dance',
      'Partying',
      'Gaming',
      'Music',
      'Cooking',
      'Anime',
    ],
  },
]

export default ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    if (userInformation?.hobbies) {
      reset({
        nature: userInformation?.hobbies?.nature,
        dietaryPreferences: userInformation?.hobbies?.dietaryPreferences,
        workStyle: userInformation?.hobbies?.workStyle,
        smokingPreference: userInformation?.hobbies?.smokingPreference,
        drinkingPreference: userInformation?.hobbies?.drinkingPreference,
        guestPolicy: userInformation?.hobbies?.guestPolicy,
        workHours: userInformation?.hobbies?.workHours,
        regionalBackground: userInformation?.hobbies?.regionalBackground,
        interests: userInformation?.hobbies?.interests,
      })
    }
  }, [userInformation])
  return (
    // <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
    <div className="flex flex-col items-center justify-center  animateRegistration overflow-scroll">
      <div className="w-3/4  py-16 flex flex-col justify-between gap-8">
        <button onClick={() => setStep((step) => step - 1)}>
          <GoArrowLeft size={24} />
        </button>
        <div className="flex flex-col gap-2">
          <div
            className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
          >
            <span>Let's Get To</span>
            <span>Know You A</span>
            <span>Liiittle Better...</span>
          </div>
          <p className="text-primary font-light text-sm">
            Let's learn about your lifestyle & hobbies to find your best match
          </p>
        </div>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit((hobbies) => {
            setLoading(true)
            localStorage.setItem(
              'userInformation',
              JSON.stringify({ ...userInformation, hobbies })
            )
            setStep((step: number) => step + 1)
            setTimeout(() => {}, 300)
            setLoading(false)
            console.log(hobbies)
          })}
        >
          {questionnare.map((question) => (
            <div key={question.id} className="flex flex-col capitalize gap-1">
              <span className="font-semibold text-base">
                {question.heading}
              </span>
              <div className="flex flex-row gap-2 align items-start flex-wrap">
                {question.options.map((option, index) => (
                  <label
                    key={option}
                    className="flex text-sm items-center py-2 px-3 border-solid border border-black rounded-full has-[:checked]:bg-button-primary has-[:checked]:border-button-primary"
                    htmlFor={option}
                  >
                    <span className="w-max">{option}</span>
                    <input
                      {...register(`${question.id}`, {
                        required: 'This field is required',
                      })}
                      className="hidden"
                      type={question.type}
                      value={option}
                      name={question.id}
                      id={option}
                    />
                  </label>
                ))}
              </div>
              {errors[question.id] && (
                <ErrorMessage text={errors[question.id!.toString()]?.message} />
              )}
            </div>
          ))}
          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-6">
            Next
          </button>
        </form>
      </div>
    </div>
  )
}
