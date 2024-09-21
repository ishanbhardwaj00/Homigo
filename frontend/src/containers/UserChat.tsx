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
import Loading from '../components/Loading'
import { MatchContext } from '../contexts/matchContext'
import axios from 'axios'
import { AuthContext } from '../contexts/authContext'

type MessageType = { type: string; message: string }
const UserChat = () => {
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
  const { chats, setChats, sendJsonMessage, lastMessage, readyState } =
    useContext(ChatContext)
  const { user } = useContext(AuthContext)
  const { matches } = useContext(MatchContext)
  const { userId } = useParams()

  useEffect(() => {
    async function markAndSetReadReciepts() {
      console.log(chats[userId])

      if (chats[userId].lastMessage.sender === userId) {
        try {
          axios.post(
            'http://localhost:5000/api/chats/read',
            { receiver: userId },
            { withCredentials: true }
          )
        } catch (error) {
          console.log('axios bg task failed')
        }

        setChats((prevChats) => {
          let updatedChats = prevChats
          updatedChats = {
            ...updatedChats,
            [userId]: {
              ...updatedChats[userId],
              lastMessage: {
                ...updatedChats[userId].lastMessage,
                readBy: [user.id],
              },
            },
          }
          console.log(updatedChats)

          return updatedChats
        })
      }
    }
    markAndSetReadReciepts()
  }, [])

  useEffect(() => {
    if (chats) {
      console.log(chats)
    }
  }, [chats])

  // useEffect(() => {
  //   if (lastMessage) {
  //     console.log(chats)

  //     const { content, sender } = JSON.parse(lastMessage?.data)

  //     setChats((prevChats: any) => {
  //       console.log(prevChats)

  //       if (prevChats[sender]) {
  //         console.log(sender, prevChats)

  //         return {
  //           ...prevChats,
  //           [sender]: {
  //             ...prevChats[sender],
  //             messages: [...prevChats[sender].messages, { sender, content }],
  //           },
  //         }
  //       } else {
  //         console.log('First time for this sender')
  //         return {
  //           ...prevChats,
  //           [sender]: { messages: [{ sender, content }] },
  //         }
  //       }
  //     })
  //   }
  // }, [lastMessage])
  useEffect(() => {
    if (lastMessage) {
      console.log('LAST Message', lastMessage.data)

      // setChats((prevChats: any) => {
      //   prevChats[userId].messages = [
      //     ...prevChats[userId]?.messages,
      //     { sender: userId, content: lastMessage.data },
      //   ]
      //   return prevChats
      // })
      // setMessages((messages) => [
      //   ...messages,
      //   { sender: userId, content: lastMessage.data },
      // ])
    }
  }, [lastMessage])

  if (chats === null) return <Loading />
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
      <div className="flex flex-1 flex-col p-6 gap-4 overflow-y-scroll">
        {chats?.[userId]?.messages === undefined ? (
          <div className="flex flex-1 justify-center fade-in-scale-up">
            <img className="w-2/3" src="/images/ice_breaking.svg" alt="" />
          </div>
        ) : (
          chats[userId].messages.map((message, index) => {
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
      <div className="flex items-center px-6 pt-2 pb-6 animateRegistration">
        <form
          className="flex items-center gap-3 w-full h-10 rounded-full"
          onSubmit={handleSubmit((input) => {
            console.log(input)
            console.log(userId)

            const message = { receiver: userId, content: input.message }
            setChats((prevChats) => {
              console.log('settings chats from ', prevChats)

              const updatedChats = { ...prevChats }

              if (updatedChats[userId]) {
                // Updating existing user messages without mutating the state
                updatedChats[userId] = {
                  ...updatedChats[userId],
                  messages: [
                    ...updatedChats[userId].messages,
                    { sender: null, content: input.message },
                  ],
                }
              } else {
                console.log('first time')
                // Adding a new user with metadata and userDetails

                ///recipient data can be null be careful during pagination
                updatedChats[userId] = {
                  messages: [{ sender: null, content: input.message }],
                }
              }

              console.log('set chats to', updatedChats)

              return updatedChats
            })

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
