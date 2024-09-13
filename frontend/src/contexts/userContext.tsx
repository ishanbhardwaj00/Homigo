import { createContext, useRef, MutableRefObject } from 'react'

const defaultUserInformation: MutableRefObject<any> = { current: {} }

export const UserContext = createContext<{
  userInformation: MutableRefObject<any>
}>({
  userInformation: defaultUserInformation,
})

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const userInformation = useRef({})
  return (
    <UserContext.Provider value={{ userInformation }}>
      {children}
    </UserContext.Provider>
  )
}
