import { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/authContext'
import calculateAge from '../utils/calculateAge'
import { BiSolidPencil } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from '../components/Loading'
import EditPreferences from './EditPreferences'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const { register } = useForm({
    defaultValues: {
      bio: user?.metaDat?.bio,
      monthlyRentPreferences: user?.metaDat?.monthlyRent,
    },
  })
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  useEffect(() => {}, [searchParams, user])

  if (searchParams.get('edit') === 'true') {
    return <EditPreferences />
  } else if (!user) return <Loading />

  return (
    <div className="flex flex-col flex-1 gap-6 bg-nav-light fade-in-scale-up">
      <div className="flex flex-row-reverse h-10">
        <button
          onClick={() => {
            console.log('welcome')
          }}
          className="text-lg text-primary-light font-bold px-6 py-3"
        >
          Save
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-40 w-40 bg-black rounded-full border-primary border-2">
          <img
            className="w-full h-full rounded-full object-cover"
            src={user?.metaDat?.image}
            alt="pfp.jpg"
          />
          <div className="absolute flex items-center justify-center right-0 bottom-3 h-8 w-8 bg-primary border-2 border-white rounded-full">
            <BiSolidPencil size={22} color="white" />
          </div>
        </div>
        <div className="text-2xl font-bold">
          <span className="">{user?.userDetails?.fullName?.split(' ')[0]}</span>
          <span className="">
            , {calculateAge(user?.userDetails?.dateOfBirth)}
          </span>
        </div>
        <button
          onClick={() => {
            navigate('/profile?edit=true')
          }}
          className="rounded-full bg-button-primary py-2 px-4 text-sm font-medium text-primary"
        >
          Edit Profile
        </button>
      </div>
      <div className="flex flex-col items-center">
        <form className="w-4/5 flex gap-5 flex-col">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <span className="text-base font-medium text-button-radio-button ml-3">
                Bio
              </span>
              <span>
                <BiSolidPencil color="gray" size={18} />
              </span>
            </div>
            <textarea
              {...register('bio', {
                required: 'This field is required',
              })}
              className="w-full h-36 border rounded-3xl px-5 py-3 text-base border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="Tell us about you – your vibe, your quirks, and what makes you a great roommate!"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium text-button-radio-button ml-3">
              Monthly Rent Preferences*
            </p>
            <input
              {...register('monthlyRentPreferences', {
                required: 'This field is required',
                validate: (data) => {
                  return !isNaN(data) || 'Should be a number'
                },
              })}
              className="w-full border rounded-3xl py-3 px-5 text-base border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="Enter A Number"
            />
            {/* {errors.monthlyRentPreferences && (
              <ErrorMessage
                text={errors.monthlyRentPreferences.message!.toString()}
              />
            )} */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
