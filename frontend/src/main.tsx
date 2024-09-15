import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Parent from './Parent.tsx'
import Login from './containers/Login.tsx'
import Register from './containers/Register.tsx'
import AuthContextProvider from './contexts/authContext.tsx'
import { UserContextProvider } from './contexts/userContext.tsx'
import MatchContextProvider from './contexts/matchContext.tsx'
import Main from './containers/Main.tsx'
import Chats from './containers/Chat.tsx'
import UserChat from './containers/UserChat.tsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthContextProvider>
        <Login />
      </AuthContextProvider>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthContextProvider>
        <UserContextProvider>
          <Register />
        </UserContextProvider>
      </AuthContextProvider>
    ),
  },
  {
    path: '/chats/:id',
    element: (
      <AuthContextProvider>
        <UserChat />
      </AuthContextProvider>
    ),
  },
  {
    path: '/',
    element: (
      <AuthContextProvider>
        <Parent />
      </AuthContextProvider>
    ),
    children: [
      {
        path: '',
        element: (
          <MatchContextProvider>
            <Main />
          </MatchContextProvider>
        ),
      },
      {
        path: 'chats',
        element: <Chats />,
      },
      {
        path: 'profile',
        element: <div className="flex flex-1">profile</div>,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
