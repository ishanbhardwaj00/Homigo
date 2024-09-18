import { useContext, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ChatContext } from '../contexts/chatContext'
import useWebSocket from 'react-use-websocket'
import Loading from '../components/Loading'
import { MatchContext } from '../contexts/matchContext'

const Chats = () => {
  const navigate = useNavigate()
  const { chats } = useContext(ChatContext)

  const { matches } = useContext(MatchContext)

  useEffect(() => {
    console.log('chats updated')
  }, [chats])
  useEffect(() => {
    console.log('matches updated', matches)
  }, [matches])
  console.log('Chat.tsx, ', chats)
  if (Object.values(chats).length === 0)
    return (
      // <Outlet />
      <div className="flex flex-1 flex-col justify-center items-center gap-8 fade-in-scale-up">
        <img className="w-2/3" src="/images/no_chats.svg" alt="" />
        <button
          onClick={() => {
            navigate('/')
          }}
          className="w-3/4 rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
        >
          Find My Roommate
        </button>
      </div>
    )
  return (
    <div className="flex flex-col flex-1 gap-2 fade-in-scale-up overflow-scroll">
      <div className="flex flex-col py-7 px-7 gap-5">
        <span className="capitalize text-lg text-gray-dark font-medium">
          queued (2)
        </span>
        <div className="flex gap-4">
          <span className="border-2 border-primary solid rounded-full h-24 w-24">
            <img
              src="/images/matched_dp.jpg"
              className="h-full w-full bg-cover rounded-full"
            />
          </span>
          <span className="border-2 border-primary solid rounded-full h-24 w-24">
            <img
              src="/images/matched_dp.jpg"
              className="h-full w-full bg-cover rounded-full"
            />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <span className="capitalize text-gray-dark text-lg font-medium px-7">
          recents
        </span>
        {/* cards */}
        <div className="flex flex-col gap-2 p-1">
          {Object.entries(chats).map(([senderId, chat], index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  navigate(`/chats/${senderId}`, {
                    state: {
                      img: matches[senderId]?.metaDat?.image,
                      name: matches[senderId]?.userDetails?.fullName,
                    },
                  })
                }}
                className="flex  w-full p-1 px-7 gap-3 active:bg-slate-200 rounded-2xl"
              >
                <span className="rounded-full h-20 w-20">
                  <img
                    src={matches[senderId]?.metaDat.image}
                    className="h-full w-full object-cover rounded-full"
                  />
                </span>
                <div className="flex flex-col justify-center w-full">
                  <span className="capitalize text-xl font-medium">
                    {matches[senderId]?.userDetails.fullName}
                  </span>
                  <span className="text-gray-dark text-base text-ellipsis max-w-40 overflow-hidden whitespace-nowrap">
                    {chat?.messages?.at(chat?.messages?.length - 1)?.content ??
                      null}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Chats
