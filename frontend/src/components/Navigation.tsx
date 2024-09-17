import React, { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const imageNames = ['profile.svg', 'match.svg', 'chat.svg']

const Navigation = ({
  setSelected,
  selected,
}: {
  setSelected: any
  selected: number
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname.includes('/chats/')) return <div className="h-0"></div>
  return (
    <div className="h-20 bg-nav-light rounded-3xl flex justify-around items-center ">
      {imageNames.map((img, index) => (
        <div className="h-8 w-8" key={index}>
          <img
            key={index}
            src={`/images/${img}`}
            alt={img}
            onClick={() => {
              if (index === 0) {
                navigate('/profile')
              } else if (index === 1) {
                navigate('/')
              } else if (index === 2) {
                navigate('/chats')
              }
              setSelected(index)
            }}
            className={`${
              selected === index && 'image-filter'
            } w-full h-full object-contain ${
              img === 'match.svg' && 'scale-150'
            } `}
          />
        </div>
      ))}
    </div>
  )
}

export default Navigation
