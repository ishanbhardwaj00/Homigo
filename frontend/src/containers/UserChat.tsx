import { useContext, useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { RxDotsVertical } from 'react-icons/rx'
import { IoMdSend } from 'react-icons/io'
import useWebSocket from 'react-use-websocket'
import {
  useParams,
  useSearchParams,
  useHref,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import { useForm } from 'react-hook-form'
import chatContext, { ChatContext } from '../contexts/chatContext'

type MessageType = { type: string; message: string }
const UserChat = () => {
  const { readyState, sendJsonMessage, lastMessage } = useWebSocket(
    'http://localhost:5000'
  )
  useEffect(() => {}, [readyState])
  const { userId } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const navigate = useNavigate()
  const location = useLocation()
  const { img, name } = location.state
  const { chats } = useContext(ChatContext)

  const [messages, setMessages] = useState(null)
  console.log(messages)

  useEffect(() => {
    console.log(chats)
    setMessages(chats[userId]?.messages)
  }, [])

  useEffect(() => {
    console.log(messages)
  }, [messages])

  // useEffect(() => {
  //   if (lastMessage)
  //     setMessages((messages) => [
  //       ...messages,
  //       { receiver: 1, content: lastMessage.data },
  //     ])
  // }, [lastMessage])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center py-3 gap-8 px-3 border border-b-2 justify-between animateChatHeader">
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
                src={img}
                className="h-full w-full object-cover rounded-full"
              />
            </span>
            <span className="capitalize text-xl font-semibold ">{name}</span>
          </div>
        </div>
        <button onClick={() => console.log('rxdots')}>
          <RxDotsVertical color="#232beb" size={32} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-6 gap-4">
        {messages && messages?.length === 0 ? (
          <div className="flex flex-1 justify-center fade-in-scale-up">
            <img className="w-2/3" src="/images/ice_breaking.svg" alt="" />
          </div>
        ) : (
          messages?.map((message, index) => {
            if (message.sender === userId) {
              return (
                <span
                  key={index}
                  className="animateSenderChat self-start max-w-3/4 p-3 items-center rounded-tl-xl rounded-tr-xl rounded-br-xl bg-slate-300 text-wrap"
                >
                  {message.content}
                </span>
              )
            } else {
              return (
                <span
                  key={index}
                  className="animateRecieverChat self-end max-w-3/4 p-3  rounded-tl-xl items-center  rounded-tr-xl rounded-bl-xl bg-primary-light text-white text-wrap"
                >
                  {message.content}
                </span>
              )
            }
          })
        )}
      </div>
      <div className="flex items-center p-6 animateRegistration">
        <form
          className="flex items-center gap-3 w-full h-10 rounded-full"
          onSubmit={handleSubmit((input) => {
            console.log(input)
            console.log(userId)

            const message = { receiver: userId, content: input.message }
            setMessages((messages) => [
              ...messages,
              { receiver: 1, content: input.message },
            ])

            sendJsonMessage({
              jsonMessage: JSON.stringify(message),
              keep: true,
            })
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
