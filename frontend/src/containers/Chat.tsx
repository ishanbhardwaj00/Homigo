import { Link, Outlet, useNavigate } from 'react-router-dom'

const Chats = () => {
  const navigate = useNavigate()

  return (
    // <Outlet />
    <div className="flex flex-1 flex-col justify-center items-center gap-8 fade-in-scale-up">
      <img className="w-2/3" src="/images/no_chats.svg" alt="" />
      <button
        onClick={() => {
          navigate('/')
        }}
        className="w-3/4 rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
      >
        Find My Roommate
      </button>
    </div>
  )
  return (
    <div className="flex flex-col flex-1 gap-2 fade-in-scale-up">
      <div className="flex flex-col py-7 px-7 gap-5">
        <span className="capitalize text-lg text-gray-dark font-medium">
          queued (2)
        </span>
        <div className="flex gap-4">
          <span className="border-2 border-primary solid rounded-full h-24 w-24">
            <img
              src="/images/matched_dp.jpg"
              className="h-full w-full bg-cover rounded-full"
            />
          </span>
          <span className="border-2 border-primary solid rounded-full h-24 w-24">
            <img
              src="/images/matched_dp.jpg"
              className="h-full w-full bg-cover rounded-full"
            />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <span className="capitalize text-gray-dark text-lg font-medium px-7">
          recents
        </span>
        {/* cards */}
        <div className="flex flex-col gap-2 p-1">
          <div
            onClick={() => {
              navigate('/chats/1')
            }}
            className="flex  w-full p-1 px-7 gap-3 active:bg-slate-200 rounded-2xl"
          >
            <span className="rounded-full h-20 w-20">
              <img
                src="/images/matched_dp.jpg"
                className="h-full w-full bg-cover rounded-full"
              />
            </span>
            <div className="flex flex-col justify-center">
              <span className="capitalize text-xl font-medium">ishan</span>
              <span className="text-gray-dark text-lg text-light">
                you're cool
              </span>
            </div>
          </div>
          <div className="flex  w-full p-1 px-7 gap-3">
            <span className="rounded-full h-20 w-20">
              <img
                src="/images/matched_dp.jpg"
                className="h-full w-full bg-cover rounded-full"
              />
            </span>
            <div className="flex flex-col justify-center">
              <span className="capitalize text-xl font-medium">ishan</span>
              <span className="text-gray-dark text-lg text-light">
                you're cool
              </span>
            </div>
          </div>
          <div className="flex  w-full p-1 px-7 gap-3">
            <span className="rounded-full h-20 w-20">
              <img
                src="/images/matched_dp.jpg"
                className="h-full w-full bg-cover rounded-full"
              />
            </span>
            <div className="flex flex-col justify-center">
              <span className="capitalize text-xl font-medium">ishan</span>
              <span className="text-gray-dark text-lg text-light">
                you're cool
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats
