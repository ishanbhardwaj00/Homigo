'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthContextProvider, { AuthContext } from '@/contexts/authContext'
import { UserContextProvider } from '@/contexts/userContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <UserContextProvider>{children}</UserContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
