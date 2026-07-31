import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ApnaTutorHub — Early Access',
  description:
    'Join the ApnaTutorHub early access waitlist. Connect parents and students with the best tutors across India. Learn Anything, Anytime, Anywhere!',
  keywords: ['tutor', 'education', 'home tuition', 'online tutoring', 'ApnaTutorHub'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
