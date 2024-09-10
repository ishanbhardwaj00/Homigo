import React, { useState } from 'react'

const imageNames = ['profile.svg', 'match.svg', 'chat.svg']

const Navigation = ({setSelected, selected}:{setSelected:any, selected:number}) => {
  return (
    <div className="h-20 bg-nav-light rounded-3xl flex justify-between px-5">
      {imageNames.map((img, index) => (
        <img
          key={index}
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
 