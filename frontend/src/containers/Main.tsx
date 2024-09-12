import axios from 'axios'
import { useEffect, useState } from 'react'
import 'swiper/css'
import { SwiperSlide, Swiper, useSwiper } from 'swiper/react'

function calculateAge(dobString) {
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
  const [users, setUsers] = useState([])
  useEffect(() => {
    console.log('fetching users')

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users', {
          withCredentials: true,
        })
        setUsers(response.data.users)
        console.log(response.data) // Check the response
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers() // Call the async function inside useEffect
  }, [])
  useEffect(() => {}, [users])
  const swiper = useSwiper()
  return (
    <div className="flex flex-1 w-screen overflow-scroll p-5">
      <Swiper
        className="flex flex-1 rounded-lg"
        spaceBetween={30}
        slidesPerView={1}
        onSlideChange={() => {
          console.log('slide changed')
        }}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {users.map(
          (user, index) =>
            user?.profileCompleted && (
              <div className="flex flex-col items-center justify-center w-full h-full overflow-y-scroll bg-white">
                <SwiperSlide className="p-5 bg-white overflow-y-scroll">
                  <div className="flex justify-center h-3/4 w-full items-center self-center">
                    <img
                      className="object-cover h-full w-full rounded-lg"
                      src={user?.metaDat?.image}
                      alt=""
                    />
                  </div>
                  <div className="ml-2 flex flex-col gap-1">
                    <div className="flex flex-col mt-4">
                      <span className="text-3xl font-bold leading-sm">
                        {user?.userDetails?.fullName?.split(' ')[0]},{' '}
                        {calculateAge(user?.userDetails?.dateOfBirth)}
                      </span>
                      <span className="text-lg font-light">
                        Gurgaon, Haryana
                      </span>
                    </div>
                    <div className="flex text-primary items-center gap-2 mt-2">
                      <img
                        src="/images/friendship.svg"
                        className="h-8 w-8"
                        alt=""
                      />
                      <span className="font-bold text-xl">98%</span>
                      <span className="font-light text-sm">
                        | 25/30 Preferences Matched
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-userdetails mt-5 flex flex-col gap-5 py-2 px-5 rounded-lg">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-lg">About Me</span>
                      <span className="font-light">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Veritatis fugiat neque eveniet aspernatur error.
                        Aperiam dolorem sed labore accusamus maiores dolor
                        incidunt deleniti et, soluta dicta voluptatibus
                        explicabo necessitatibus ipsum facilis eaque non, ab
                        eligendi, dignissimos totam. Dolorum, natus ipsa?
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-lg">Basic Info</span>
                      <label
                        key={user}
                        className="flex text-sm items-center font-normal py-2 px-3 border-solid border border-black rounded-full has-[:checked]:bg-button-primary has-[:checked]:border-button-primary"
                      >
                        <span className="w-max"></span>
                      </label>
                    </div>
                  </div>
                </SwiperSlide>
              </div>
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
