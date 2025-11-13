import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HuntWays Travel - Twój kreator podróży',
  description: 'Zaplanuj swoją wymarzoną podróż z HuntWays Travel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}

