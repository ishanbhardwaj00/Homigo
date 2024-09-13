import React, { useState } from 'react'

const imageNames = ['profile.svg', 'match.svg', 'chat.svg']

const Navigation = ({
  setSelected,
  selected,
}: {
  setSelected: any
  selected: number
}) => {
  return (
    <div className="h-20 bg-nav-light rounded-3xl flex justify-around items-center">
      {imageNames.map((img, index) => (
        <div className="h-8 w-8">
          <img
            key={index}
            src={`/images/${img}`}
            alt={img}
            onClick={() => {
              setSelected(index)
            }}
            className={`${
              selected === index && 'image-filter '
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
