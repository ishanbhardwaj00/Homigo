import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import 'swiper/css'
import { SwiperSlide, Swiper, useSwiper, SwiperRef } from 'swiper/react'
import { MatchContext } from '../contexts/matchContext'
import { useNavigate } from 'react-router-dom'
function calculateAge(dobString: string) {
  // Step 1: Parse the date of birth string into a Date object
  const dob = new Date(dobString)

  // Step 2: Get today's date
  const today = new Date()

  // Step 3: Calculate the difference in years
  let age = today.getFullYear() - dob.getFullYear()

  // Step 4: Adjust age if the birth date hasn't occurred yet this year
  const monthDifference = today.getMonth() - dob.getMonth()
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age-- // Subtract one year if birthday hasn't happened yet
  }

  return age
}

const Main = () => {
  const navigate = useNavigate()
  const { matches } = useContext(MatchContext)
  const swiperRef = useRef<SwiperRef>(null)
  const savedIndex = Number(localStorage.getItem('swiperIndex') || 0)
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(savedIndex, 0) // Restore saved slide
    }
  }, [])
  return (
    <div className="flex flex-1 w-screen overflow-scroll bg-match bg-auto bg-center bg-no-repeat p-8 fade-in ">
      <Swiper
        ref={swiperRef}
        className="flex rounded-2xl"
        spaceBetween={100}
        slidesPerView={1}
        onSlideChange={(swiper) => {
          localStorage.setItem('swiperIndex', String(swiper.activeIndex))
        }}
      >
        {matches &&
          matches.map(
            (user: any, ind: number) =>
              user?.profileCompleted && (
                <SwiperSlide
                  key={ind}
                  className="p-4 bg-white overflow-y-scroll fade-in-scale-up"
                >
                  {/* <div className="h-max"> */}
                  <img
                    className="object-cover h-3/4 w-full rounded-xl"
                    src={user?.metaDat?.image}
                    alt=""
                  />
                  <div className="ml-2 flex flex-col gap-3">
                    <div className="flex flex-col mt-5 gap-1">
                      <span className="text-3xl font-bold leading-sm">
                        {user?.userDetails?.fullName?.split(' ')[0]},{' '}
                        {calculateAge(user?.userDetails?.dateOfBirth)}
                      </span>
                      <span className="text-lg font-light">
                        Gurgaon, Haryana
                      </span>
                    </div>
                    <div className="flex text-primary items-center gap-1 mt-2">
                      <img
                        src="/images/friendship.svg"
                        className="h-6 w-6"
                        alt=""
                      />
                      <span className="font-bold text-xl">98%</span>
                      <span className="font-light text-sm">
                        | 25/30 Preferences Matched
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-userdetails mt-5 flex flex-col gap-8 py-4 px-5 rounded-xl justify-center">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-lg">About Me</span>
                      <span className="font-light ">{user?.metaDat?.bio}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-lg">Basic Info</span>
                      {user?.hobbies && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(user?.hobbies)
                            .filter(([key]) => key !== 'interests') // Exclude 'interests' field
                            .map(([key, value], idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-transparent rounded-full border border-solid border-black w-max capitalize font-light "
                              >
                                {value as string}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-lg">
                        Hobbies & Interests
                      </span>
                      {user?.hobbies?.interests && (
                        <div className="flex flex-wrap gap-2">
                          {user?.hobbies?.interests.map(
                            (value: string, idx: number) => (
                              <div
                                key={idx}
                                className="p-3 bg-transparent rounded-full border border-solid border-black w-max capitalize font-light"
                              >
                                {value}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full justify-center">
                    <button
                      onClick={() => {
                        navigate(`/chats/${user?._id}`, {
                          state: {
                            name: user?.userDetails?.fullName?.split(' ')[0],
                            img: user?.metaDat?.image,
                          },
                        })
                        localStorage.setItem('swiperIndex', String(ind))
                      }}
                      className="w-11/12 rounded-full bg-button-primary py-3 text-2xl font-bold text-primary mt-6"
                    >
                      Message
                    </button>
                  </div>
                  {/* </div> */}
                </SwiperSlide>
              )
          )}
      </Swiper>
    </div>
  )
}

export default Main

// {
//   <div
//             style={{
//               backgroundImage: `url(${user?.metaDat?.image})`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               borderRadius: '10px',
//               height: '400px',
//               color: 'white',
//               display: 'flex',
//               alignItems: 'flex-end',
//               justifyContent: 'center',
//               padding: '20px',
//             }}
//           >
//             <h3>
//               {user?.userDetails?.fullName?.split(' ')[0]},{' '}
//               {calculateAge(user?.userDetails?.dateOfBirth)}
//             </h3>
//           </div>
// }

// ;<Swiper
//   spaceBetween={30}
//   slidesPerView={1}
//   navigation
//   pagination={{ clickable: true }}
//   style={{ height: '100%' }} // Ensures Swiper takes full height
// >
//   {/* Add your slides here */}
//   <SwiperSlide style={{ backgroundColor: 'lightcoral' }}>Slide 1</SwiperSlide>
//   <SwiperSlide style={{ backgroundColor: 'lightblue' }}>Slide 2</SwiperSlide>
//   <SwiperSlide style={{ backgroundColor: 'lightgreen' }}>Slide 3</SwiperSlide>
// </Swiper>
