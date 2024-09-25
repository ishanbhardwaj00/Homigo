import { IoSearch } from 'react-icons/io5'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import Searchbar from '../components/Searchbar'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StaysContext } from '../contexts/staysContext'
import Loading from '../components/Loading'

function formatNumberToIndianStyle(num) {
  // Convert number to string
  const numString = num.toString()

  // Split the string into integer and decimal parts if any
  const [integerPart, decimalPart] = numString.split('.')

  // Use a regular expression to add commas
  const lastThreeDigits = integerPart.slice(-3)
  const otherDigits = integerPart.slice(0, -3)
  const formattedIntegerPart =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    (otherDigits ? ',' : '') +
    lastThreeDigits

  // Return the formatted number
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart
}

const Stays = () => {
  const { stays } = useContext(StaysContext)

  const navigate = useNavigate()

  if (!stays) return <Loading />
  return (
    <div className="flex flex-col flex-1 p-6 fade-in-scale-up overflow-scroll">
      <div className="h-16">
        <Searchbar />
      </div>
      <div className="flex flex-col flex-1 overflow-y-scroll gap-4">
        {Object.values(stays).map((stay) => (
          <div
            onClick={() => {
              navigate(`/stays/${stay._id}`)
            }}
            className="flex flex-col w-full bg-white rounded-lg shadow-lg"
          >
            <div className="flex justify-between p-4 pb-3 items-center ">
              <span className="py-1 px-2 text-button-radio-button bg-location font-medium text-xs  rounded-full font-poppins-medium">
                {stay?.LOCALITY}
              </span>
              <span>
                <HiOutlineDotsVertical size={25} color="#232BEB" />
              </span>
            </div>
            <div className="flex">
              <img
                className="h-48 w-full object-cover"
                src={stay?.URL}
                alt=""
              />
            </div>
            <div className="flex flex-col px-4 py-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-poppins-semi">
                  INR {formatNumberToIndianStyle(stay.Rent)}
                </span>
                <span className="text-sm text-gray-400">/ month</span>
              </div>
              <div className="text-sm text-button-radio-button">
                <span>{stay?.BEDROOM_NUM} Private Rooms | </span>
                <span>{stay?.FURNISH} | </span>
                <span>{stay?.FLOOR_NUM} Floor</span>
              </div>
              <div className="text-sm text-button-radio-button">
                <span>{stay?.PROPERTY_TYPE}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stays
