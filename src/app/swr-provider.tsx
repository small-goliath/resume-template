/**
 * SWR Provider 컴포넌트
 * 전역 SWR 설정 및 캐시 관리
 */

'use client'

import { SWRConfig } from 'swr'
import type { ReactNode } from 'react'

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // 전역 SWR 옵션
        revalidateOnFocus: true, // 포커스 시 재검증
        revalidateOnReconnect: true, // 재연결 시 재검증
        dedupingInterval: 2000, // 중복 요청 방지 간격 (2초)
        errorRetryCount: 3, // 에러 발생 시 재시도 횟수
        errorRetryInterval: 5000, // 재시도 간격 (5초)
        shouldRetryOnError: true, // 에러 발생 시 재시도 여부
        // 개발 환경에서만 에러 로그 출력
        onError: (error, key) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('[SWR Error]', key, error)
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
