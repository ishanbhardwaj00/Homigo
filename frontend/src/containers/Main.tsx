import Loading from '@/components/Loading'
import { userSchema } from '@/schemas/zUserInfo'
import axios from 'axios'
import { log } from 'console'
import { useEffect, useState } from 'react'
import TinderCard from 'react-tinder-card'
import ProfileCards from './ProfileCards'
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
  useEffect(() => {}, [users])

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

  return (
    <div className="flex h-full flex-1 p-5 gap-3">
      {users && users.length > 0 && <ProfileCards users={users} />}
    </div>
  )
}

export default Main
