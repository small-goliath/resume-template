import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SWRProvider } from './swr-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '개발자 포트폴리오',
  description: '개발자 경력 및 프로젝트 포트폴리오',
  keywords: ['개발자', '포트폴리오', 'developer', 'portfolio'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}
