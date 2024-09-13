'use client'
import { AuthContext } from '@/contexts/authContext'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { LuSettings2 } from 'react-icons/lu'

const Header = ({ selected }: { selected: number }) => {
  const { setAuthenticated } = useContext(AuthContext)
  const router = useRouter()
  return (
    <div className="flex h-20 py-2 px-4 bg-nav-light text-primary items-center justify-between">
      {/* <IoIosArrowBack size={36} /> */}
      <img
        onClick={() => {
          router.replace('/')
        }}
        src="/images/logo-text.svg"
        alt=""
        className="image-filter h-1/2"
      />
      {selected === 1 && (
        <LuSettings2
          onClick={async () => {
            await axios.post(
              'http://localhost:5000/api/users/logout',
              {},
              { withCredentials: true }
            )
            setAuthenticated(false)
          }}
          size={36}
          className="rotate-90"
        />
      )}
    </div>
  )
}

export default Header
