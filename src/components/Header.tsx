'use client'
import { IoIosArrowBack } from 'react-icons/io'
import { LuSettings2 } from 'react-icons/lu'

const Header = () => {
  return (
    <div className="flex h-20 p-2 bg-nav-light text-primary items-center justify-between">
      <IoIosArrowBack size={36} />
      <img src="/images/logo-text.svg" alt="" className="image-filter h-1/2" />
      <LuSettings2 size={36} className="rotate-90" />
    </div>
  )
}

export default Header
