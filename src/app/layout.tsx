import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'linkink - Collect your favorite things',
  description: 'Create shelves of your favorite pop culture items. Share with friends, discover new things.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
