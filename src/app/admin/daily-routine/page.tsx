'use client'

/**
 * 일일 루틴 관리 페이지
 *
 * 24시간 루틴 시계 데이터 CRUD 기능 제공
 */

import { useState, useEffect, useMemo } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useDailyRoutine } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, Clock, AlertCircle } from 'lucide-react'
import type { DailyRoutine } from '@/types'

/**
 * 색상 옵션
 */
const colorOptions = [
  { value: 'neon-cyan', label: 'Neon Cyan (사이안)', color: '#00f0ff' },
  { value: 'neon-magenta', label: 'Neon Magenta (마젠타)', color: '#ff00ff' },
  { value: 'neon-purple', label: 'Neon Purple (보라)', color: '#9d00ff' },
  { value: 'neon-green', label: 'Neon Green (초록)', color: '#00ff41' },
  { value: 'neon-orange', label: 'Neon Orange (오렌지)', color: '#ff6b00' },
]

/**
 * 강도 옵션
 */
const intensityOptions = [
  { value: 'dim', label: 'Dim (낮음)' },
  { value: 'medium', label: 'Medium (중간)' },
  { value: 'bright', label: 'Bright (높음)' },
]

/**
 * 시간대 충돌 검증 헬퍼 함수
 */

/**
 * 두 시간 범위가 겹치는지 확인
 * 자정을 넘어가는 경우도 처리 (예: 23시 ~ 2시)
 */
function checkTimeOverlap(
  start1Hour: number,
  start1Minute: number,
  end1Hour: number,
  end1Minute: number,
  start2Hour: number,
  start2Minute: number,
  end2Hour: number,
  end2Minute: number
): boolean {
  // 시간을 분 단위로 변환 (0-1439분, 24시간 = 1440분)
  const toMinutes = (hour: number, minute: number) => hour * 60 + minute

  let start1 = toMinutes(start1Hour, start1Minute)
  let end1 = toMinutes(end1Hour, end1Minute)
  let start2 = toMinutes(start2Hour, start2Minute)
  let end2 = toMinutes(end2Hour, end2Minute)

  // 자정 경계 처리: 종료 시간이 시작 시간보다 작으면 다음 날로 간주 (1440분 추가)
  if (end1 < start1) end1 += 1440
  if (end2 < start2) end2 += 1440

  // 겹침 체크
  // 1) 기본 케이스: 두 구간이 같은 날 안에 있는 경우
  if (start1 <= end2 && start2 <= end1) {
    return true
  }

  // 2) 자정 경계를 넘는 경우: 다음 날 구간과도 비교
  // 첫 번째 구간이 자정을 넘는 경우
  if (end1 >= 1440) {
    const nextDayStart1 = start1 - 1440
    const nextDayEnd1 = end1 - 1440
    if (nextDayStart1 <= end2 && start2 <= nextDayEnd1) {
      return true
    }
  }

  // 두 번째 구간이 자정을 넘는 경우
  if (end2 >= 1440) {
    const nextDayStart2 = start2 - 1440
    const nextDayEnd2 = end2 - 1440
    if (start1 <= nextDayEnd2 && nextDayStart2 <= end1) {
      return true
    }
  }

  return false
}

/**
 * 현재 입력값과 겹치는 기존 루틴들 찾기
 */
function findOverlappingRoutines(
  currentRoutine: { start_hour: number; start_minute: number; end_hour: number; end_minute: number; id?: string },
  allRoutines: DailyRoutine[]
): DailyRoutine[] {
  return allRoutines.filter((routine) => {
    // 수정 중인 루틴은 제외
    if (currentRoutine.id && routine.id === currentRoutine.id) {
      return false
    }

    return checkTimeOverlap(
      currentRoutine.start_hour,
      currentRoutine.start_minute,
      currentRoutine.end_hour,
      currentRoutine.end_minute,
      routine.start_hour,
      routine.start_minute || 0,
      routine.end_hour,
      routine.end_minute || 0
    )
  })
}

/**
 * 일일 루틴 폼 스키마
 */
const routineSchema = z.object({
  start_hour: z.number().min(0).max(23),
  start_minute: z.number().min(0).max(59),
  end_hour: z.number().min(0).max(23),
  end_minute: z.number().min(0).max(59),
  label: z.string().min(1, '라벨을 입력해주세요').max(100, '라벨은 100자 이내여야 합니다'),
  color: z.enum(['neon-cyan', 'neon-magenta', 'neon-purple', 'neon-green', 'neon-orange']),
  intensity: z.enum(['dim', 'medium', 'bright']),
  sort_order: z.number().min(0, '정렬 순서는 0 이상이어야 합니다'),
})

type RoutineFormData = z.infer<typeof routineSchema>

export default function AdminDailyRoutinePage() {
  const { data: routines, isLoading, mutate } = useDailyRoutine()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DailyRoutine | null>(null)
  const [deletingItem, setDeletingItem] = useState<DailyRoutine | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      start_hour: 0,
      start_minute: 0,
      end_hour: 1,
      end_minute: 0,
      label: '',
      color: 'neon-cyan',
      intensity: 'medium',
      sort_order: 0,
    },
  })

  const selectedColor = watch('color')
  const selectedIntensity = watch('intensity')
  const watchedStartHour = watch('start_hour')
  const watchedStartMinute = watch('start_minute')
  const watchedEndHour = watch('end_hour')
  const watchedEndMinute = watch('end_minute')

  /**
   * 현재 입력값과 겹치는 루틴들 계산
   */
  const overlappingRoutines = useMemo(() => {
    if (!routines || watchedStartHour === undefined || watchedEndHour === undefined) {
      return []
    }

    return findOverlappingRoutines(
      {
        start_hour: watchedStartHour,
        start_minute: watchedStartMinute || 0,
        end_hour: watchedEndHour,
        end_minute: watchedEndMinute || 0,
        id: editingItem?.id,
      },
      routines
    )
  }, [routines, watchedStartHour, watchedStartMinute, watchedEndHour, watchedEndMinute, editingItem?.id])

  /**
   * 새 루틴 추가 버튼 클릭
   */
  const handleAdd = () => {
    setEditingItem(null)
    reset({
      start_hour: 0,
      end_hour: 1,
      label: '',
      color: 'neon-cyan',
      intensity: 'medium',
      sort_order: routines?.length || 0,
    })
    setIsDialogOpen(true)
  }

  /**
   * 루틴 수정 버튼 클릭
   */
  const handleEdit = (item: DailyRoutine) => {
    setEditingItem(item)
    reset({
      start_hour: item.start_hour,
      start_minute: item.start_minute || 0,
      end_hour: item.end_hour,
      end_minute: item.end_minute || 0,
      label: item.label,
      color: item.color,
      intensity: item.intensity,
      sort_order: item.sort_order,
    })
    setIsDialogOpen(true)
  }

  /**
   * 루틴 삭제 버튼 클릭
   */
  const handleDelete = (item: DailyRoutine) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  /**
   * 폼 제출 (생성 또는 수정)
   */
  const onSubmit = async (data: RoutineFormData) => {
    setIsSubmitting(true)

    try {
      if (editingItem) {
        // 수정
        await apiClient.put(`/daily-routine/${editingItem.id}`, data)
        toast.success('루틴이 수정되었습니다')
      } else {
        // 생성
        await apiClient.post('/daily-routine', data)
        toast.success('루틴이 추가되었습니다')
      }

      await mutate()
      setIsDialogOpen(false)
      reset()
    } catch (error) {
      console.error('Failed to save routine:', error)
      toast.error(editingItem ? '루틴 수정에 실패했습니다' : '루틴 추가에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * 루틴 삭제 확인
   */
  const confirmDelete = async () => {
    if (!deletingItem) return

    setIsDeleting(true)

    try {
      await apiClient.delete(`/daily-routine/${deletingItem.id}`)
      toast.success('루틴이 삭제되었습니다')
      await mutate()
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (error) {
      console.error('Failed to delete routine:', error)
      toast.error('루틴 삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  /**
   * 시간 포맷팅 (0-23시)
   */
  /**
   * 시간을 HH:MM 형식으로 포맷
   */
  const formatTime = (hour: number, minute: number = 0) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  /**
   * 색상 인디케이터
   */
  const ColorIndicator = ({ color }: { color: string }) => {
    const colorHex = colorOptions.find((c) => c.value === color)?.color || '#00f0ff'
    return (
      <div
        className="h-4 w-4 rounded-full"
        style={{
          backgroundColor: colorHex,
          boxShadow: `0 0 8px ${colorHex}`,
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="일일 루틴 관리"
        description="24시간 루틴 시계 데이터 관리"
      />

      {/* 추가 버튼 */}
      <div className="flex justify-end">
        <Button onClick={handleAdd} variant="neon">
          <Plus className="mr-2 h-4 w-4" />
          루틴 추가
        </Button>
      </div>

      {/* 루틴 목록 */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <Table>
            <TableHeader>
              <TableRow className="border-[--color-neon-cyan-800] hover:bg-[--color-black-surface]">
                <TableHead className="text-[--color-neon-cyan-500]">시간</TableHead>
                <TableHead className="text-[--color-neon-cyan-500]">라벨</TableHead>
                <TableHead className="text-[--color-neon-cyan-500]">색상</TableHead>
                <TableHead className="text-[--color-neon-cyan-500]">강도</TableHead>
                <TableHead className="text-[--color-neon-cyan-500]">순서</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-500]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routines?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-[--color-neon-cyan-700]">
                    등록된 루틴이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                routines?.map((routine) => (
                  <TableRow
                    key={routine.id}
                    className="border-[--color-neon-cyan-800] hover:bg-[--color-black-surface]"
                  >
                    <TableCell className="font-mono text-[--color-neon-cyan-400]">
                      {formatTime(routine.start_hour, routine.start_minute || 0)} ~ {formatTime(routine.end_hour, routine.end_minute || 0)}
                    </TableCell>
                    <TableCell className="text-[--color-neon-cyan-400]">{routine.label}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ColorIndicator color={routine.color} />
                        <span className="text-sm text-[--color-neon-cyan-600]">
                          {colorOptions.find((c) => c.value === routine.color)?.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[--color-neon-cyan-600]">
                      {intensityOptions.find((i) => i.value === routine.intensity)?.label}
                    </TableCell>
                    <TableCell className="text-[--color-neon-cyan-400]">
                      {routine.sort_order}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(routine)}
                          className="text-[--color-neon-cyan-500] hover:bg-[--color-black-surface] hover:text-[--color-neon-cyan-400]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(routine)}
                          className="text-[--color-neon-orange-500] hover:bg-[--color-black-surface] hover:text-[--color-neon-orange-400]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 생성/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!bg-[--color-black-elevated] border-[--color-neon-cyan-700] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[--color-neon-cyan-500]">
              {editingItem ? '루틴 수정' : '루틴 추가'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 시간대 충돌 경고 */}
            {overlappingRoutines.length > 0 && (
              <div className="rounded-md border border-[--color-neon-orange-600] bg-[--color-neon-orange-500]/10 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[--color-neon-orange-500]" />
                  <div className="space-y-2">
                    <p className="font-semibold text-[--color-neon-orange-500]">
                      ⚠️ 시간대 충돌 경고
                    </p>
                    <p className="text-sm text-[--color-neon-orange-400]">
                      다음 루틴과 시간이 겹칩니다:
                    </p>
                    <ul className="space-y-1 text-sm text-[--color-neon-orange-400]">
                      {overlappingRoutines.map((routine) => (
                        <li key={routine.id} className="font-mono">
                          • {routine.label} ({formatTime(routine.start_hour, routine.start_minute || 0)} ~ {formatTime(routine.end_hour, routine.end_minute || 0)})
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[--color-neon-orange-500]">
                      💡 저장은 가능하지만, 시계에서 루틴이 겹쳐 보일 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 시작 시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_hour" className="text-[--color-neon-cyan-500]">
                  시작 시간 (0-23시)
                </Label>
                <Input
                  id="start_hour"
                  type="number"
                  min={0}
                  max={23}
                  {...register('start_hour', { valueAsNumber: true })}
                  className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]"
                />
                {errors.start_hour && (
                  <p className="text-sm text-[--color-neon-orange-500]">{errors.start_hour.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_minute" className="text-[--color-neon-cyan-500]">
                  시작 분 (0-59분)
                </Label>
                <Input
                  id="start_minute"
                  type="number"
                  min={0}
                  max={59}
                  {...register('start_minute', { valueAsNumber: true })}
                  className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]"
                />
                {errors.start_minute && (
                  <p className="text-sm text-[--color-neon-orange-500]">{errors.start_minute.message}</p>
                )}
              </div>
            </div>

            {/* 종료 시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="end_hour" className="text-[--color-neon-cyan-500]">
                  종료 시간 (0-23시)
                </Label>
                <Input
                  id="end_hour"
                  type="number"
                  min={0}
                  max={23}
                  {...register('end_hour', { valueAsNumber: true })}
                  className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]"
                />
                {errors.end_hour && (
                  <p className="text-sm text-[--color-neon-orange-500]">{errors.end_hour.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_minute" className="text-[--color-neon-cyan-500]">
                  종료 분 (0-59분)
                </Label>
                <Input
                  id="end_minute"
                  type="number"
                  min={0}
                  max={59}
                  {...register('end_minute', { valueAsNumber: true })}
                  className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]"
                />
                {errors.end_minute && (
                  <p className="text-sm text-[--color-neon-orange-500]">{errors.end_minute.message}</p>
                )}
              </div>
            </div>

            {/* 라벨 */}
            <div className="space-y-2">
              <Label htmlFor="label" className="text-[--color-neon-cyan-500]">
                라벨
              </Label>
              <Input
                id="label"
                {...register('label')}
                placeholder="예: 취침, 출근, 회사업무"
                className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]"
              />
              {errors.label && (
                <p className="text-sm text-[--color-neon-orange-500]">{errors.label.message}</p>
              )}
            </div>

            {/* 색상 선택 */}
            <div className="space-y-2">
              <Label className="text-[--color-neon-cyan-500]">색상</Label>
              <Select value={selectedColor} onValueChange={(value) => setValue('color', value as any)}>
                <SelectTrigger className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[--color-neon-cyan-700] bg-[--color-black-elevated]">
                  {colorOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-[--color-neon-cyan-400] focus:bg-[--color-black-surface] focus:text-[--color-neon-cyan-300]"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: option.color,
                            boxShadow: `0 0 6px ${option.color}`,
                          }}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 강도 선택 */}
            <div className="space-y-2">
              <Label className="text-[--color-neon-cyan-500]">강도</Label>
              <Select
                value={selectedIntensity}
                onValueChange={(value) => setValue('intensity', value as any)}
              >
                <SelectTrigger className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[--color-neon-cyan-700] bg-[--color-black-elevated]">
                  {intensityOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-[--color-neon-cyan-400] focus:bg-[--color-black-surface] focus:text-[--color-neon-cyan-300]"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 정렬 순서 */}
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-[--color-neon-cyan-500]">
                정렬 순서
              </Label>
              <Input
                id="sort_order"
                type="number"
                min={0}
                {...register('sort_order', { valueAsNumber: true })}
                className="border-[--color-neon-cyan-700] bg-[--color-black-surface] text-[--color-neon-cyan-400]"
              />
              {errors.sort_order && (
                <p className="text-sm text-[--color-neon-orange-500]">{errors.sort_order.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="text-[--color-neon-cyan-600] hover:text-[--color-neon-cyan-500]"
              >
                취소
              </Button>
              <Button type="submit" variant="neon" disabled={isSubmitting}>
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
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="루틴 삭제"
        description={`"${deletingItem?.label || ''}" 루틴을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      />
    </div>
  )
}
