'use client'
import { Poppins } from 'next/font/google'
import { useRouter } from 'next/navigation'
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
    ],
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
    <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
      <div className="w-3/4  py-16 flex flex-col justify-between gap-8">
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
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) => {
            setStep((step) => step + 1)
            console.log(data)
          })}
        >
          {questionnare.map((question) => (
            <div key={question.id} className="flex flex-col capitalize gap-1">
              <span className="font-semibold text-lg">{question.heading}</span>
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
                <ErrorMessage text={errors[question.id]?.message} />
              )}
            </div>
          ))}
          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-4">
            Next
          </button>
        </form>
      </div>
    </div>
  )
}

const locations = [
  'Near Cyberhub',
  'Near Unitech CyberPark',
  'Near Golf Course Ext',
  'Near Millenium City Centre',
  'Near Old Gurgaon',
  'Near IMT Manesar',
  'Near Phase II',
]
const StepFive = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
      <div className="w-3/4  py-16 flex flex-col justify-between gap-14">
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
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) => {
            setStep((step) => step + 1)
            console.log(data)
          })}
        >
          <div className="flex flex-col text-button-radio-button font-semibold gap-2">
            <span>
              <p className="text-sm">Where Would You Prefer To Stay?</p>
              <p className="text-xs font-thin text-button-radio-button"></p>
            </span>
            <div>
              {locations.map((location, index) => (
                <label
                  className="flex justify-start p-2 items-center gap-3"
                  key={index}
                  htmlFor={location}
                >
                  <input
                    type="checkbox"
                    className="appearance-none bg-transparent border border-solid border-gray-300 w-4 h-3 checked:border-primary"
                    value={location}
                    id={location}
                    {...register('locationPreferences', {
                      required: 'This field is required',
                    })}
                  />
                  <div className="flex flex-col w-full gap-1">
                    <span className="text-xs font-normal w-max">
                      {location}
                    </span>
                    <div className="w-full h-px bg-gray-300 "></div>
                  </div>
                </label>
              ))}
              {errors.locationPreferences && (
                <ErrorMessage text={errors.locationPreferences.message} />
              )}
            </div>
          </div>
          <div className="flex flex-col text-button-radio-button font-semibold gap-2">
            <div className="flex flex-col gap-2">
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
                  <ErrorMessage text={errors.nonVegPreference.message} />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col text-button-radio-button font-semibold gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm">What is your preferred lease duration?</p>
              <p className="text-xs font-thin text-button-radio-button"></p>
              <div className="flex gap-2 flex-wrap ">
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
              {errors.lease && <ErrorMessage text={errors.lease.message} />}
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

const StepSix = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const [image, setImage] = useState(null)
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
      <div className="w-3/4  py-12 flex flex-col justify-between gap-12">
        <div className="flex flex-col gap-2">
          <div
            className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
          >
            <span>We're Almost</span>
            <span>There</span>
          </div>
          <p className="text-primary">Let's put the final piece in place</p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) => {
            console.log(data)
            router.push('/')
          })}
        >
          <div className="avatar-container self-center">
            <input
              {...register('image', { required: 'Image is required' })}
              type="file"
              accept="image/*"
              id="file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-input"
              className="avatar-label border-primary border-2"
            >
              {image ? (
                <img src={image} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="flex avatar-placeholder text-base">
                  <span className="text-3xl font-bold">+</span>
                  <span>Upload Your Picture</span>
                </div>
              )}
            </label>
          </div>
          {errors.image && <ErrorMessage text={errors.image.message} />}

          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-button-radio-button ml-2">
              Bio*
            </p>
            <div className="flex justify-center items-center">
              <textarea
                {...register('bio', { required: 'This field is required' })}
                className="w-full h-36 border rounded-lg p-3 text-base border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Tell us about you – your vibe, your quirks, and what makes you a great roommate!"
              />
            </div>
          </div>
          {errors.bio && <ErrorMessage text={errors.bio.message} />}

          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-button-radio-button ml-2">
              Monthly Rent Preferences
            </p>
            <div className="flex">
              <input
                {...register('monthlyRentPreferences', {
                  required: 'This field is required',
                  validate: (data) => {
                    return !isNaN(data) || 'Should be a number'
                  },
                })}
                className="w-full border rounded-lg p-3 text-base border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Enter A Number"
              />
            </div>
            {errors.monthlyRentPreferences && (
              <ErrorMessage text={errors.monthlyRentPreferences.message} />
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

const page = () => {
  const [step, setStep] = useState<number>(1)

  if (step === 1) return <StepOne setStep={setStep} />
  else if (step === 2) return <StepTwo setStep={setStep} />
  else if (step == 3) return <StepThree setStep={setStep} />
  else if (step === 4) return <StepFour setStep={setStep} />
  else if (step === 5) return <StepFive setStep={setStep} />
  else if (step === 6) return <StepSix setStep={setStep} />
}

export default page
