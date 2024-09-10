const Main = () => {
  return (
    <div className="flex flex-col flex-grow overflow-scroll justify-center items-center p-5">
      <div className="h-full bg-white w-full rounded-lg px-5 py-7">
        <div className="h-3/4 w-full">
          <img
            className="object-cover h-full w-full rounded-lg"
            src="/images/matched_dp.jpg"
            alt=""
          />
        </div>
        <div className="ml-2 flex flex-col gap-1">
          <div className="flex flex-col mt-4">
            <span className="text-3xl font-bold leading-sm">Ishan, 23</span>
            <span className="text-lg font-light">Gurgaon, Haryana</span>
          </div>
          <div className="flex text-primary items-center gap-2 mt-2">
            <img src="/images/friendship.svg" alt="" />
            <span className="font-bold">98%</span>
            <span className="font-light">| 25/30 Preferences Matched</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
