'use client'

/**
 * 동료평가 이미지 갤러리 섹션 컴포넌트
 *
 * 동료평가 이미지를 반응형 그리드로 표시하고, 클릭 시 Lightbox로 확대 기능 제공
 * - yet-another-react-lightbox 라이브러리 사용
 * - 반응형 그리드: 모바일 2열, 태블릿 3열, 데스크톱 4열
 * - 이미지 호버 시 확대 애니메이션
 * - 키보드 네비게이션 (ESC, 화살표)
 * - 연도별 정렬 (최신이 위)
 */

import { useState } from 'react'
import Image from 'next/image'
import { Images, ZoomIn, Calendar } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePeerReviews } from '@/lib/hooks/use-portfolio-data'
import type { PeerReview } from '@/types'

/**
 * 동료평가 섹션 Props 인터페이스
 */
interface PeerReviewsSectionProps {
  className?: string
}

/**
 * 동료평가 섹션 메인 컴포넌트
 */
export function PeerReviewsSection({ className }: PeerReviewsSectionProps) {
  const { data: peerReviews, isLoading, error } = usePeerReviews()

  if (isLoading) {
    return <PeerReviewsSectionSkeleton />
  }

  if (error) {
    return <PeerReviewsSectionError error={error.message} />
  }

  if (!peerReviews || peerReviews.length === 0) {
    return <PeerReviewsSectionEmpty />
  }

  // sort_order 기준 정렬 (최신이 위)
  const sortedReviews = [...peerReviews].sort(
    (a, b) => b.sort_order - a.sort_order
  )

  return (
    <PeerReviewsSectionContent reviews={sortedReviews} className={className} />
  )
}

/**
 * 동료평가 섹션 컨텐츠 (데이터 로드 완료 상태)
 */
interface PeerReviewsSectionContentProps {
  reviews: PeerReview[]
  className?: string
}

function PeerReviewsSectionContent({
  reviews,
  className,
}: PeerReviewsSectionContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Lightbox 슬라이드 데이터 생성
  const slides = reviews.map(review => ({
    src: review.image_url,
    alt: review.description || `${review.year}년 동료평가`,
  }))

  // 이미지 클릭 핸들러
  const handleImageClick = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  return (
    <section className={`space-y-6 ${className || ''}`}>
      {/* 섹션 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2.5 backdrop-blur-sm">
            <Images className="size-5 text-purple-500 dark:text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Peer Reviews</h2>
        </div>
        <p className="text-muted-foreground ml-[52px] text-sm">
          동료들이 작성한 평가 이미지 갤러리
        </p>
      </div>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {reviews.map((review, index) => (
          <ImageCard
            key={review.id}
            review={review}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentIndex}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
        }}
        animation={{
          fade: 300,
          swipe: 300,
        }}
        carousel={{
          finite: true,
          preload: 2,
        }}
      />
    </section>
  )
}

/**
 * 이미지 카드 컴포넌트
 */
interface ImageCardProps {
  review: PeerReview
  onClick: () => void
}

function ImageCard({ review, onClick }: ImageCardProps) {
  return (
    <Card
      variant="neon-border"
      className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:border-pink-500/30"
      onClick={onClick}
    >
      {/* 이미지 컨테이너 */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <Image
          src={review.thumbnail_url || review.image_url}
          alt={review.description || `${review.year}년 동료평가`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-white/20 p-3 ring-2 ring-white/40 backdrop-blur-md">
              <ZoomIn className="size-6 text-white" />
            </div>
            <p className="text-xs font-medium text-white/90">클릭하여 확대</p>
          </div>
        </div>

        {/* 연도 Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="border border-white/20 bg-black/40 font-mono text-xs font-semibold text-white backdrop-blur-md"
          >
            <Calendar className="mr-1 size-3" />
            {review.year}
          </Badge>
        </div>
      </div>

      {/* 설명 (있을 경우) */}
      {review.description && (
        <div className="border-t bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-3 backdrop-blur-sm">
          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {review.description}
          </p>
        </div>
      )}
    </Card>
  )
}

/**
 * 로딩 상태 Skeleton UI
 */
function PeerReviewsSectionSkeleton() {
  return (
    <section className="space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="ml-[52px] h-4 w-64" />
      </div>

      {/* 그리드 스켈레톤 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="space-y-3 overflow-hidden rounded-xl border">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="p-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-1.5 h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * 에러 상태 UI
 */
interface PeerReviewsSectionErrorProps {
  error: string
}

function PeerReviewsSectionError({ error }: PeerReviewsSectionErrorProps) {
  return (
    <section className="border-destructive/30 bg-destructive/5 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-destructive/10 rounded-full p-3">
          <svg
            className="text-destructive size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-destructive text-lg font-semibold">
            동료평가 이미지를 불러올 수 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    </section>
  )
}

/**
 * 빈 데이터 상태 UI
 */
function PeerReviewsSectionEmpty() {
  return (
    <section className="border-border/50 bg-muted/30 overflow-hidden rounded-2xl border p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted rounded-full p-3">
          <Images className="text-muted-foreground size-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-lg font-semibold">
            동료평가 이미지가 없습니다
          </h3>
          <p className="text-muted-foreground text-sm">
            관리자 페이지에서 동료평가 이미지를 추가해주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
