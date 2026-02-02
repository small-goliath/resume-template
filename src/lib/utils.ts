import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * shadcn/ui에서 사용하는 cn 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
