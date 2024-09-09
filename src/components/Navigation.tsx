import React, { useState } from 'react'

const imageNames = ['profile.svg', 'match.svg', 'chat.svg']

const Navigation = () => {
  const [selected, setSelected] = useState(1)
  return (
    <div className="h-20 bg-nav-light rounded-3xl flex justify-between px-5">
      {imageNames.map((img, index) => (
        <img
          src={`/images/${img}`}
          alt={img}
          onClick={() => {
            setSelected(index)
          }}
          className={`${selected === index && 'image-filter'}`}
        />
      ))}
    </div>
  )
}

export default Navigation
