import { useState, useRef, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../contexts/authContext'
import { FaArrowLeft } from 'react-icons/fa'
import { BarLoader, PulseLoader } from 'react-spinners'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { GoArrowLeft } from 'react-icons/go'
import axios from 'axios'
import { UserContext, UserContextProvider } from '../contexts/userContext'

export default ({ setStep }: { setStep: any }) => {
  const { userInformation } = useContext(UserContext)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      bio: userInformation.get('bio'),
      monthlyRentPreferences: userInformation.get('monthlyRentPreferences'),
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      userInformation.set('image', file)
      reader.readAsDataURL(file) // Converts the file to a Base64-encoded string
    }
  }
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AuthContext)

  const [image, setImage] = useState(null)
  // const router = useRouter();
  const [requestPending, setRequestPending] = useState(false)
  return (
    <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
      <div className="w-3/4  py-8 flex flex-col justify-between gap-12">
        <button onClick={() => setStep((step: number) => step - 1)}>
          <GoArrowLeft size={24} />
        </button>
        <div className="flex flex-col gap-2">
          <div className={`flex flex-col text-4xl font-bold text-primary `}>
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
            console.log(data)
            userInformation.set('bio', data.bio)
            userInformation.set(
              'monthlyRentPreferences',
              data.monthlyRentPreferences
            )
            console.log(...userInformation.entries())
            setRequestPending(true)

            try {
              const response = await axios.patch(
                'http://localhost:5000/api/users/signup',
                userInformation,
                {
                  withCredentials: true,
                }
              )
              console.log(response.data)
              setUser(userInformation)
              setAuthenticated(true)
              // router.replace("/");
            } catch (error) {
              console.log(error)
            } finally {
              setRequestPending(false)
            }
          })}
        >
          <div className="avatar-container self-center">
            <input
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
                {...register('bio', {
                  required: 'This field is required',
                })}
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
          <button
            // disabled={requestPending}
            className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-8"
          >
            {requestPending ? (
              <PulseLoader color="#232beb" size={8} />
            ) : (
              'Start Matching'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
