import Loading from '@/components/Loading'
import { userSchema } from '@/schemas/zUserInfo'
import axios from 'axios'
import { log } from 'console'
import { useEffect, useState } from 'react'

const Main = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
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
  return (
    <div className="flex flex-col h-full flex-1 overflow-y-scroll p-5 gap-3">
      {users &&
        users.length > 0 &&
        users.map((user, index) => (
          <div className="flex flex-col min-h-full bg-white min-w-full rounded-lg px-5 py-7">
            <div className="h-3/4 w-full">
              <img
                className="object-cover h-full w-full rounded-lg"
                src="/images/matched_dp.jpg"
                alt=""
              />
            </div>
            <div className="ml-2 flex flex-col gap-1">
              <div className="flex flex-col mt-4">
                <span className="text-3xl font-bold leading-sm">Ishan, 23</span>
                <span className="text-lg font-light">Gurgaon, Haryana</span>
              </div>
              <div className="flex text-primary items-center gap-2 mt-2">
                <img src="/images/friendship.svg" alt="" />
                <span className="font-bold">98%</span>
                <span className="font-light">| 25/30 Preferences Matched</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Main
