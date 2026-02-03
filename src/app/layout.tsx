import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { SWRProvider } from './swr-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: '사이버펑크 포트폴리오 | Cyberpunk Developer',
  description: '사이버펑크 스타일의 개발자 포트폴리오. 네온이 빛나는 개발자의 세계.',
  keywords: [
    '개발자',
    '포트폴리오',
    'developer',
    'portfolio',
    'cyberpunk',
    'neon',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}
