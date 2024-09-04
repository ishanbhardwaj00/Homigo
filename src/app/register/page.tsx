'use client'
import { log } from 'console'
import { Poppins } from 'next/font/google'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const poppins = Poppins({
  weight: ['300', '400', '700'],
  style: 'normal',
  subsets: ['latin'],
})

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
]
const ErrorMessage = ({ text }) => {
  return <p className="ml-4 text-red-500 text-xs">{text}</p>
}
const StepOne = ({ setStep }: { setStep: any }) => {
  return (
    <div className="flex flex-col items-center bg-step1 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom animateRegistration ">
      <div className="w-3/4 flex flex-col justify-start mt-24 gap-12">
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>Let's Keep It</span>
          <span>Real,</span>
          <span>Verify With,</span>
          <span>Aadhar</span>
        </div>
        <div className={`flex flex-col ${poppins.className} gap-3`}>
          <span className={`${poppins.className}`}>
            Enter your Aadhar Number*
          </span>
          <input
            className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
            type="text"
            placeholder="xxxx-xxxx-xxxx-xxxx"
          />
          <button
            onClick={() => {
              setStep((step) => step + 1)
            }}
            className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
const StepTwo = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
  return (
    <div className="flex flex-col items-center bg-step2 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom animateRegistration">
      <div className="w-3/4 flex flex-col justify-start mt-24 gap-24">
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>Secure Your </span>
          <span>Access &</span>
          <span>Login Anytime!</span>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data)
            setStep((step) => step + 1)
          })}
          className="flex flex-col gap-4"
        >
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
              })}
              placeholder="Password"
            />
            {errors.password && <ErrorMessage text={errors.password.message} />}
          </div>
          <div className="flex flex-col gap-1">
            <input
              className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === getValues('password') || 'Passwords must match',
              })}
              placeholder="Password"
            />
            {errors.confirmPassword && (
              <ErrorMessage text={errors.confirmPassword.message} />
            )}
          </div>

          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary">
            Next
          </button>
        </form>
      </div>
    </div>
  )
}
const StepThree = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
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
          onSubmit={handleSubmit((data) => {
            console.log(data)
            setStep((step) => step + 1)
          })}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <p className="text-black font-bold ml-4">Your Full Name*</p>
            <input
              className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2 text-gray-500"
              type="text"
              {...register('fullName', {
                required: 'This field is required',
              })}
              placeholder="John Doe"
            />
            {errors.fullName && <ErrorMessage text={errors.fullName.message} />}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-black font-bold ml-4">Your Birth Date*</p>
            <input
              className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2 text-gray-500"
              type="date"
              {...register('dateOfBirth', {
                required: 'Date is required',
              })}
            />
            {errors.dateOfBirth && (
              <ErrorMessage text={errors.dateOfBirth.message} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-black font-bold ml-4">What's your gender?</p>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="Male"
                className="flex p-4 bg-button-radio w-full justify-between rounded-full text-button-radio-button"
              >
                <span>Male</span>
                <input
                  className="rounded-full w-5 h-5 outline-none border-primary"
                  {...register('gender', {
                    required: 'This field is required',
                  })}
                  type="radio"
                  name="gender"
                  value="Male"
                  id="Male"
                />
              </label>
              <label
                htmlFor="Female"
                className="flex p-4 bg-button-radio w-full justify-between rounded-full text-button-radio-button"
              >
                <span>Female</span>
                <input
                  className="rounded-full w-5 h-5 outline-none border-primary"
                  {...register('gender', {
                    required: 'This field is required',
                  })}
                  type="radio"
                  value="Female"
                  name="gender"
                  id="Female"
                />
              </label>
              <label
                htmlFor="Other"
                className="flex p-4 bg-button-radio w-full justify-between rounded-full text-button-radio-button"
              >
                <span>Other</span>
                <input
                  className="rounded-full w-5 h-5 outline-none border-primary"
                  {...register('gender', {
                    required: 'This field is required',
                  })}
                  type="radio"
                  value="Other"
                  name="gender"
                  id="Other"
                />
              </label>
              {errors.gender && <ErrorMessage text={errors.gender?.message} />}
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
const StepFour = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
  return (
    <div className="flex flex-col items-center justify-center h-screen max-h-screen bg-bottom animateRegistration">
      <div className="w-3/4  flex flex-col justify-between gap-16">
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
          className="flex flex-col gap-2"
          onSubmit={handleSubmit((data) => console.log(data))}
        >
          {questionnare.map((question) => (
            <div className="flex flex-col capitalize gap-4">
              <span className="font-semibold">{question.heading}</span>
              <div className="flex flex-row gap-2 align items-start flex-wrap">
                {question.options.map((option, index) => (
                  <label
                    className="flex text-sm items-center py-2 px-3 border-solid border-2 border-black rounded-full has-[:checked]:bg-green-300 has-[:checked]:border-0"
                    htmlFor={option}
                  >
                    <span className="w-max">{option}</span>
                    <input
                      className="hidden"
                      type={question.type}
                      name={question.id}
                      id={option}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}
const page = () => {
  const [step, setStep] = useState<number>(4)

  if (step === 1) return <StepOne setStep={setStep} />
  else if (step === 2) return <StepTwo setStep={setStep} />
  else if (step == 3) return <StepThree setStep={setStep} />
  else if (step === 4) return <StepFour setStep={setStep} />
}

export default page
