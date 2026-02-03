'use client'

/**
 * 타임라인 관리 페이지
 *
 * 타임라인 CRUD 기능 제공
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { useTimeline } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import type { Timeline } from '@/types'

/**
 * 타임라인 폼 스키마
 */
const timelineSchema = z.object({
  year: z.number().min(1900, '1900년 이후 연도를 입력해주세요').max(2100, '2100년 이전 연도를 입력해주세요'),
  company: z.string().min(1, '회사명을 입력해주세요').max(200, '회사명은 200자 이내여야 합니다'),
  role: z.string().min(1, '역할을 입력해주세요').max(200, '역할은 200자 이내여야 합니다'),
  events: z.string().optional(),
  sort_order: z.number().min(0, '정렬 순서는 0 이상이어야 합니다'),
})

type TimelineFormData = z.infer<typeof timelineSchema>

export default function AdminTimelinePage() {
  const { data: timeline, isLoading, mutate } = useTimeline()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Timeline | null>(null)
  const [deletingItem, setDeletingItem] = useState<Timeline | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimelineFormData>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      company: '',
      role: '',
      events: '',
      sort_order: 0,
    },
  })

  /**
   * 새 타임라인 추가 버튼 클릭
   */
  const handleAddClick = () => {
    setEditingItem(null)
    reset({
      year: new Date().getFullYear(),
      company: '',
      role: '',
      events: '',
      sort_order: timeline ? timeline.length : 0,
    })
    setIsDialogOpen(true)
  }

  /**
   * 편집 버튼 클릭
   */
  const handleEditClick = (item: Timeline) => {
    setEditingItem(item)
    reset({
      year: item.year,
      company: item.company,
      role: item.role,
      events: item.events.join('\n'),
      sort_order: item.sort_order,
    })
    setIsDialogOpen(true)
  }

  /**
   * 삭제 버튼 클릭
   */
  const handleDeleteClick = (item: Timeline) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  /**
   * 폼 제출 (생성/수정)
   */
  const onSubmit = async (data: TimelineFormData) => {
    setIsSubmitting(true)
    try {
      // events를 줄바꿈으로 분리하여 배열로 변환 (없으면 빈 배열)
      const eventsArray = data.events
        ? data.events.split('\n').filter(e => e.trim() !== '')
        : []

      const payload = {
        year: data.year,
        company: data.company,
        role: data.role,
        events: eventsArray,
        sort_order: data.sort_order,
      }

      console.log('[DEBUG] 전송할 payload:', payload)

      if (editingItem) {
        // 수정
        await apiClient.put(`/timeline/${editingItem.id}`, payload)
        toast.success('타임라인이 성공적으로 수정되었습니다')
      } else {
        // 생성
        await apiClient.post('/timeline', payload)
        toast.success('타임라인이 성공적으로 추가되었습니다')
      }

      await mutate()
      setIsDialogOpen(false)
      reset()
    } catch (error) {
      // API 에러의 상세 정보 추출
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string; statusCode?: number }).message
        : '알 수 없는 오류가 발생했습니다'

      const statusCode = error && typeof error === 'object' && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode
        : undefined

      console.error('[ERROR] 타임라인 저장 실패:', {
        error,
        errorMessage,
        statusCode,
      })

      toast.error(
        editingItem
          ? `타임라인 수정에 실패했습니다: ${errorMessage}`
          : `타임라인 추가에 실패했습니다: ${errorMessage}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * 삭제 확인
   */
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return

    setIsDeleting(true)
    try {
      console.log('[DEBUG] 삭제할 타임라인 ID:', deletingItem.id)
      await apiClient.delete(`/timeline/${deletingItem.id}`)
      toast.success('타임라인이 성공적으로 삭제되었습니다')
      await mutate()
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : '알 수 없는 오류가 발생했습니다'

      console.error('[ERROR] 타임라인 삭제 실패:', error)
      toast.error(`타임라인 삭제에 실패했습니다: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="타임라인 관리"
        description="경력 타임라인을 추가/수정/삭제합니다"
        action={
          <Button
            variant="neon"
            size="default"
            onClick={handleAddClick}
            className="gap-2"
          >
            <Plus className="size-4" />
            새 타임라인 추가
          </Button>
        }
      />

      {/* 타임라인 목록 */}
      {isLoading ? (
        <TimelineTableSkeleton />
      ) : timeline && timeline.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-cyan-800] hover:bg-[--color-neon-cyan-500]/5">
                <TableHead className="text-[--color-neon-cyan-600]">연도</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">회사</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">역할</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">이벤트</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">정렬</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-600]">
                  작업
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeline
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-[--color-neon-cyan-900] transition-colors hover:bg-[--color-neon-cyan-500]/5"
                  >
                    <TableCell className="font-mono text-[--color-neon-cyan-400]">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-[--color-neon-cyan-600]" />
                        {item.year}
                      </div>
                    </TableCell>
                    <TableCell className="text-[--color-neon-cyan-300]">
                      {item.company}
                    </TableCell>
                    <TableCell className="text-[--color-neon-cyan-400]">
                      {item.role}
                    </TableCell>
                    <TableCell className="max-w-md text-[--color-neon-cyan-500]">
                      <ul className="list-inside list-disc space-y-1 font-mono text-sm">
                        {item.events.slice(0, 2).map((event, idx) => (
                          <li key={idx} className="truncate">{event}</li>
                        ))}
                        {item.events.length > 2 && (
                          <li className="text-[--color-neon-cyan-700]">
                            +{item.events.length - 2}개 더보기
                          </li>
                        )}
                      </ul>
                    </TableCell>
                    <TableCell className="font-mono text-[--color-neon-cyan-600]">
                      {item.sort_order}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(item)}
                          className="text-[--color-neon-cyan-500] hover:bg-[--color-neon-cyan-500]/10"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(item)}
                          className="text-[--color-neon-orange-500] hover:bg-[--color-neon-orange-500]/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-12 text-center shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <Calendar className="mx-auto mb-4 size-12 text-[--color-neon-cyan-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-cyan-600]">
            타임라인이 없습니다
          </h3>
          <p className="mb-6 font-mono text-sm text-[--color-neon-cyan-700]">
            새 타임라인을 추가해주세요.
          </p>
          <Button
            variant="neon"
            size="default"
            onClick={handleAddClick}
            className="gap-2"
          >
            <Plus className="size-4" />
            첫 타임라인 추가
          </Button>
        </div>
      )}

      {/* 타임라인 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-cyan-700] !bg-[#0a0a0a] opacity-100 backdrop-blur-none shadow-[0_0_30px_rgba(0,240,255,0.2)] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[--color-neon-cyan-500]">
              {editingItem ? '타임라인 수정' : '새 타임라인 추가'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 연도 */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-[--color-neon-cyan-600]">
                연도 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                placeholder="2024"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.year && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.year.message}
                </p>
              )}
            </div>

            {/* 회사명 */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-[--color-neon-cyan-600]">
                회사명 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="회사명"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.company && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.company.message}
                </p>
              )}
            </div>

            {/* 역할 */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[--color-neon-cyan-600]">
                역할 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="role"
                {...register('role')}
                placeholder="직책 / 역할"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.role && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* 이벤트 (줄바꿈으로 구분) */}
            <div className="space-y-2">
              <Label htmlFor="events" className="text-[--color-neon-cyan-600]">
                이벤트
                <span className="ml-2 font-mono text-xs text-[--color-neon-cyan-800]">
                  (선택사항 - 줄바꿈으로 구분)
                </span>
              </Label>
              <textarea
                id="events"
                {...register('events')}
                rows={5}
                placeholder="프로젝트 A 개발&#10;팀 리드 역할 수행&#10;성과 달성"
                className="flex min-h-[80px] w-full rounded-md border border-[--color-neon-cyan-800] bg-[--color-black-surface] px-3 py-2 text-sm text-[--color-neon-cyan-300] placeholder:text-[--color-neon-cyan-900] focus:outline-none focus:ring-2 focus:ring-[--color-neon-cyan-500] disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.events && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.events.message}
                </p>
              )}
            </div>

            {/* 정렬 순서 */}
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-[--color-neon-cyan-600]">
                정렬 순서 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="sort_order"
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
                placeholder="0"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.sort_order && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">
                  {errors.sort_order.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="text-[--color-neon-cyan-600] hover:bg-[--color-neon-cyan-500]/10"
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="neon"
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : editingItem ? '수정' : '추가'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="타임라인을 삭제하시겠습니까?"
        description={
          deletingItem
            ? `${deletingItem.year}년 ${deletingItem.company} - ${deletingItem.role} 항목이 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다.'
        }
        isDeleting={isDeleting}
      />
    </>
  )
}

/**
 * 로딩 스켈레톤
 */
function TimelineTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated]">
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-20 bg-[--color-black-surface]" />
              <Skeleton className="h-12 flex-1 bg-[--color-black-surface]" />
              <Skeleton className="h-8 w-24 bg-[--color-black-surface]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
