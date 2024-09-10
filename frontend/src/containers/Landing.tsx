'use client'

import { poppins } from '@/font/poppins'
import React from 'react'

const Landing = () => {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-primary bg-custom-pattern bg-no-repeat bg-center bg-cover w-full items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <img className="w-8" src="/images/logo.svg" alt="homigo-logo" />
        <img className="w-5/6" src="/images/logo-text.svg" alt="homigo-logo" />
      </div>
      <div className={`${poppins.className} flex flex-col w-4/5 gap-3`}>
        <div
          className={`flex flex-col p-4 text-3xl font-extrabold text-shadow-outline text-white drop-shadow-xl`}
        >
          <span>Your </span>
          <span>Roommate</span>
          <span>Journey Starts</span>
          <span>Here!</span>
        </div>
        <a
          href="/login"
          className="p-3 w-full outline outline-1 outline-white rounded-full text-center text-white font-bold"
        >
          Log in
        </a>
        <a
          href="/register"
          className="p-3 w-full outline outline-1 outline-white rounded-full text-center bg-white text-primary font-bold"
        >
          Sign up
        </a>
      </div>
    </div>
  )
}

export default Landing