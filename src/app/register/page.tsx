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

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
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
const ErrorMessage = ({ text }: { text: string }) => {
  return <p className="ml-2 text-red-500 text-xs">{text}</p>
}
const AadharVerify = ({ setStep }: { setStep: any }) => {
  const {
    getValues,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm()

  const userInformationJson = localStorage.getItem('userInformation')
  let userInformation = {}
  if (userInformationJson) {
    userInformation = JSON.parse(userInformationJson)
  }

  const router = useRouter()
  return (
    <div className="flex flex-col items-center bg-step1 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom animateRegistration ">
      <button onClick={() => router.back()}>
        <FaArrowLeft />
      </button>
      <div className="w-3/4 flex flex-col justify-start mt-20 gap-12">
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>Let's Keep It</span>
          <span>Real,</span>
          <span>Verify With,</span>
          <span>Aadhar</span>
        </div>
        <div className={`flex flex-col ${poppins.className} gap-4`}>
          <form
            autoComplete="off"
            className="flex flex-col gap-2"
            onSubmit={handleSubmit((data) => {
              console.log(data)
              localStorage.setItem(
                'userInformation',
                JSON.stringify({ ...userInformation, verified: true })
              )
              setStep((step: number) => step + 1)
            })}
          >
            <span className={`${poppins.className} ml-3 text-sm font-medium`}>
              Enter your Aadhar Number*
            </span>
            <input
              {...register('aadharNumber', {
                required: 'This field is required',
                minLength: {
                  value: 12,
                  message: 'Length cannot be lesser than 12',
                },
                maxLength: {
                  value: 12,
                  message: 'Length cannot be more than 12',
                },
                validate: (data) => {
                  return (
                    AadharValidator.isValidNumber(data) ||
                    'Invalid Aadhar Number'
                  )
                },
              })}
              className="w-full outline-1 outline py-4 px-5 outline-black rounded-full focus:outline-2"
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              defaultValue="277463499620"
            />
            {errors.aadharNumber && (
              <ErrorMessage text={errors.aadharNumber.message!.toString()} />
            )}
            <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary">
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
const UserSignUp = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
  const userInformationJson = localStorage.getItem('userInformation')
  let userInformation = {}
  if (userInformationJson) {
    userInformation = JSON.parse(userInformationJson)
  }
  return (
    <div className="flex flex-col items-center bg-step2 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom bg-auto animateRegistration">
      <div className="w-3/4 flex flex-col justify-start mt-20 gap-24">
        <div
          className={`${poppins.className} flex flex-col text-4xl font-bold text-primary `}
        >
          <span>Secure Your </span>
          <span>Access &</span>
          <span>Login Anytime!</span>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            //fetchUserActionsToSetUser
            console.log(userInformation)

            localStorage.setItem(
              'userInformation',
              JSON.stringify({ ...userInformation, registered: true })
            )
            setStep((step: number) => step + 1)
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
const UserDetails = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  const userInformationJson = localStorage.getItem('userInformation')
  let userInformation: any = null

  if (userInformationJson) {
    userInformation = JSON.parse(userInformationJson)
  }
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
            userInformation = { ...userInformation, userDetails }
            localStorage.setItem(
              'userInformation',
              JSON.stringify(userInformation)
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
              defaultValue={userInformation?.userDetails?.fullName || ''}
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
              defaultValue={userInformation?.userDetails?.dateOfBirth || ''}
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
                    defaultChecked={
                      gender === userInformation?.userDetails?.gender
                    }
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
const UserDetailsCont = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
  const userInformationJson = localStorage.getItem('userInformation')
  let userInformation = {}

  if (userInformationJson) {
    userInformation = JSON.parse(userInformationJson)
  }
  return (
    // <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
    <div className="flex flex-col items-center justify-center  animateRegistration overflow-scroll">
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
          className="flex flex-col gap-6"
          onSubmit={handleSubmit((hobbies) => {
            setStep((step) => step + 1)
            userInformation = { ...userInformation, hobbies }
            localStorage.setItem(
              'userInformation',
              JSON.stringify(userInformation)
            )
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
                      defaultChecked={
                        question.type === 'radio'
                          ? userInformation?.hobbies &&
                            userInformation.hobbies[question.id] === option
                          : userInformation?.hobbies &&
                            userInformation.hobbies[question.id].includes(
                              option
                            )
                      }
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

const locations = [
  'Near Cyberhub',
  'Near Unitech CyberPark',
  'Near Golf Course Ext',
  'Near Millenium City Centre',
  'Near Old Gurgaon',
  'Near IMT Manesar',
  'Near Phase II',
]
const UserPreferences = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()
  const userInformationJson = localStorage.getItem('userInformation')
  let userInformation = {}

  if (userInformationJson) {
    userInformation = JSON.parse(userInformationJson)
  }
  return (
    <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
      <div className="w-3/4  my-16 flex flex-col justify-between gap-14">
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
            userInformation = { ...userInformation, preferences }
            localStorage.setItem(
              'userInformation',
              JSON.stringify(userInformation)
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
                    defaultChecked={
                      userInformation?.preferences?.locationPreferences?.includes(
                        location
                      ) || ''
                    }
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
                      defaultChecked={
                        userInformation?.preferences?.nonVegPreference ===
                          option || false
                      }
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
                        defaultChecked={
                          userInformation?.preferences?.lease === option ||
                          false
                        }
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

const ProfileCompletion = ({ setStep }: { setStep: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] // Optional chaining to check for file existence
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string) // Ensure the result is treated as a string
      }
      reader.readAsDataURL(file) // Converts the file to a Base64-encoded string
    }
  }
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AuthContext)
  const userInformationJson = localStorage.getItem('userInformation')
  let userInformation = {}

  if (userInformationJson) {
    userInformation = JSON.parse(userInformationJson)
  }

  const [image, setImage] = useState(userInformation?.additionalInfo?.image)
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
          <p className="text-primary font-light">
            Let's put the final piece in place!
          </p>
        </div>
        <form
          className="flex flex-col gap-7"
          onSubmit={handleSubmit((data) => {
            const additionalInfo = { ...data, image: image }
            userInformation = { ...userInformation, additionalInfo }
            localStorage.setItem(
              'userInformation',
              JSON.stringify(userInformation)
            )
            setUser(userInformation)
            setAuthenticated(true)
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
                <img src={image} alt="Avatar" className="avatar-image" />
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
                defaultValue={userInformation?.additionalInfo?.bio || ''}
                className="w-full h-36 border rounded-2xl p-3 text-base border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Tell us about you – your vibe, your quirks, and what makes you a great roommate!"
              />
            </div>
          </div>
          {errors.bio && <ErrorMessage text={errors.bio.message!.toString()} />}

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
                defaultValue={
                  userInformation?.additionalInfo?.monthlyRentPreferences || ''
                }
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

const page = () => {
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AuthContext)
  const router = useRouter()
  const [step, setStep] = useState<number>(1)
  const userInformationJson = localStorage.getItem('userInformation')
  let userInformation = {}

  console.log(authenticated, user)

  if (userInformationJson) {
    userInformation = JSON.parse(userInformationJson)
  }
  // useEffect(() => {
  //   if (userInformation?.additionalInfo) {
  //     return router.replace('/home')
  //   } else if (userInformation?.preferences) {
  //     setStep(step + 5)
  //   } else if (userInformation?.hobbies) {
  //     setStep(step + 4)
  //   } else if (userInformation?.userDetails) {
  //     setStep(step + 3)
  //   } else if (userInformation?.registered) {
  //     setStep(step + 2)
  //   } else if (userInformation?.verified) {
  //     setStep(step + 1)
  //   }
  // }, [])

  useEffect(() => {
    // Redirect to home if authenticated
    if (authenticated) {
      return router.replace('/home')
    }
  }, [authenticated, router])

  if (step === 1) return <AadharVerify setStep={setStep} />
  else if (step === 2) return <UserSignUp setStep={setStep} />
  else if (step == 3) return <UserDetails setStep={setStep} />
  else if (step === 4) return <UserDetailsCont setStep={setStep} />
  else if (step === 5) return <UserPreferences setStep={setStep} />
  else if (step === 6) return <ProfileCompletion setStep={setStep} />
}

export default page
