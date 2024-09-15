import { useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { RxDotsVertical } from 'react-icons/rx'
import { IoMdSend } from 'react-icons/io'
import {
  useParams,
  useSearchParams,
  useHref,
  useNavigate,
} from 'react-router-dom'

import { useForm } from 'react-hook-form'
const UserChat = () => {
  const { userId } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' })
  console.log(userId)
  const navigate = useNavigate()
  const messages = [
    'Hey, how are you?',
    "I'm great, I was about to text you. I thought we'd be a great match!",
  ]

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center py-3 gap-8 px-3 border border-b-2 justify-between">
        <div className="flex gap-8">
          <button
            onClick={() => {
              console.log('clicked')
              navigate(-1)
            }}
          >
            <FaChevronLeft color="#232beb" size={32} />
          </button>
          <div className="flex gap-3 items-center">
            <span className="rounded-full h-14 w-14">
              <img
                src="/images/matched_dp.jpg"
                className="h-full w-full bg-cover rounded-full"
              />
            </span>
            <span className="capitalize text-xl font-semibold ">ishan</span>
          </div>
        </div>
        <button onClick={() => console.log('rxdots')}>
          <RxDotsVertical color="#232beb" size={32} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-6 gap-4">
        {messages.map((message, index) => {
          if (index & 1) {
            return (
              <span className="self-start max-w-3/4 p-3 items-center rounded-tl-xl rounded-tr-xl rounded-br-xl bg-home-light text-wrap">
                {message}
              </span>
            )
          } else {
            return (
              <span className="self-end max-w-3/4 p-3  rounded-tl-xl items-center  rounded-tr-xl rounded-bl-xl bg-primary-light text-white text-wrap">
                {message}
              </span>
            )
          }
        })}
      </div>
      <div className="flex items-center p-6">
        <form
          className="flex items-center gap-3 w-full h-10 rounded-full"
          onSubmit={handleSubmit((input) => {
            console.log(input)
          })}
        >
          <input
            {...register('message', { required: 'requied field' })}
            placeholder="Hey! How are you?"
            type="text"
            className="w-full h-10 rounded-full p-6 border border-solid text-lg focus:outline outline-2 outline-primary appearance-none"
          />
          <button disabled={errors.message}>
            <IoMdSend size={40} color={!errors.message ? '#232beb' : 'gray'} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserChat
