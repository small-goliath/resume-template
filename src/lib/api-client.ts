/**
 * FastAPI 백엔드와 통신하는 API 클라이언트
 * 모든 HTTP 요청에 대한 기본 메서드 제공
 */

import { ApiError } from '@/types'

/**
 * API 기본 URL
 * 로컬: http://localhost:3000/api
 * 프로덕션: https://your-domain.vercel.app/api (same-origin이면 /api만 사용)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

/**
 * FastAPI 에러 응답 인터페이스
 */
interface FastAPIError {
  detail: string
}

/**
 * API 클라이언트 클래스
 */
class APIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * 에러 응답 처리
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // FastAPI HTTPException 형식: { detail: string }
      const errorData = (await response
        .json()
        .catch(() => ({}))) as FastAPIError
      const message =
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`

      const error: ApiError = {
        message,
        statusCode: response.status,
      }

      throw error
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  /**
   * GET 요청
   */
  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // httpOnly 쿠키 전송 (인증용)
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      // ApiError는 그대로 throw
      if (error && typeof error === 'object' && 'message' in error) {
        throw error
      }

      // 네트워크 에러 등
      throw {
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        statusCode: 0,
      } as ApiError
    }
  }

  /**
   * POST 요청
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error
      }

      throw {
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        statusCode: 0,
      } as ApiError
    }
  }

  /**
   * PUT 요청
   */
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error
      }

      throw {
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        statusCode: 0,
      } as ApiError
    }
  }

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error
      }

      throw {
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        statusCode: 0,
      } as ApiError
    }
  }
}

/**
 * 싱글톤 API 클라이언트 인스턴스
 */
export const apiClient = new APIClient()

/**
 * APIClient 클래스 export (테스트용)
 */
export { APIClient }
