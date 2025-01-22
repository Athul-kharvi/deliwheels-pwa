import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Deliwheels App',
  description: 'Deliwheels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Deliwheels App</title>
        <meta name="description" content="Track product supply and routes" />
        <meta name="theme-color" content="#8B4513" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Deliwheels App" />
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  )
}