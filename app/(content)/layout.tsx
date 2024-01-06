import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from '@/contexts/AuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Notification from '@/components/Notification'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wittpad',
  description: "Wanna read books -- let's gooooooooooooooo",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Notification/>
          <Header/>
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  )
}
