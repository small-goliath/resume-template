'use client'

/**
 * 일일 루틴 관리 페이지
 *
 * 24시간 루틴 시계 데이터 CRUD 기능 제공
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
import { Plus, Edit, Trash2, Clock } from 'lucide-react'
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
 * 일일 루틴 폼 스키마
 */
const routineSchema = z.object({
  start_hour: z.number().min(0).max(23),
  end_hour: z.number().min(0).max(23),
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
      end_hour: 1,
      label: '',
      color: 'neon-cyan',
      intensity: 'medium',
      sort_order: 0,
    },
  })

  const selectedColor = watch('color')
  const selectedIntensity = watch('intensity')

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
      end_hour: item.end_hour,
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
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`
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
        icon={<Clock className="h-6 w-6" />}
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
                      {formatHour(routine.start_hour)} ~ {formatHour(routine.end_hour)}
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
        <DialogContent className="border-[--color-neon-cyan-700] bg-[--color-black-elevated] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[--color-neon-cyan-500]">
              {editingItem ? '루틴 수정' : '루틴 추가'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 시작 시간 */}
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

            {/* 종료 시간 */}
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
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        itemName={deletingItem?.label || ''}
      />
    </div>
  )
}
