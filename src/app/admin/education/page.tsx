'use client'

/**
 * 교육 관리 페이지
 *
 * 교육사항 CRUD 기능 제공
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
import { Textarea } from '@/components/ui/textarea'
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
import { useEducation } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import type { Education } from '@/types'

/**
 * 교육 폼 스키마
 */
const educationSchema = z.object({
  institution_name: z.string().min(1, '교육기관명을 입력해주세요').max(200, '교육기관명은 200자 이내여야 합니다'),
  start_year: z.number().min(1900, '1900년 이후 연도를 입력해주세요').max(2100, '2100년 이전 연도를 입력해주세요'),
  end_year: z.number().min(1900, '1900년 이후 연도를 입력해주세요').max(2100, '2100년 이전 연도를 입력해주세요').nullable().optional(),
  description: z.string().min(1, '설명을 입력해주세요'),
  sort_order: z.number().min(0, '정렬 순서는 0 이상이어야 합니다'),
})

type EducationFormData = z.infer<typeof educationSchema>

export default function AdminEducationPage() {
  const { data: education, isLoading, mutate } = useEducation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Education | null>(null)
  const [deletingItem, setDeletingItem] = useState<Education | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution_name: '',
      start_year: new Date().getFullYear(),
      end_year: null,
      description: '',
      sort_order: 0,
    },
  })

  const handleAddClick = () => {
    setEditingItem(null)
    reset({
      institution_name: '',
      start_year: new Date().getFullYear(),
      end_year: null,
      description: '',
      sort_order: education ? education.length : 0,
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (item: Education) => {
    setEditingItem(item)
    reset({
      institution_name: item.institution_name,
      start_year: item.start_year,
      end_year: item.end_year,
      description: item.description,
      sort_order: item.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (item: Education) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const onSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        institution_name: data.institution_name,
        start_year: data.start_year,
        end_year: data.end_year || null,
        description: data.description,
        sort_order: data.sort_order,
      }

      if (editingItem) {
        await apiClient.put(`/education/${editingItem.id}`, payload)
        toast.success('교육사항이 성공적으로 수정되었습니다')
      } else {
        await apiClient.post('/education', payload)
        toast.success('교육사항이 성공적으로 추가되었습니다')
      }

      await mutate()
      setIsDialogOpen(false)
      reset()
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : '알 수 없는 오류가 발생했습니다'

      toast.error(
        editingItem
          ? `교육사항 수정에 실패했습니다: ${errorMessage}`
          : `교육사항 추가에 실패했습니다: ${errorMessage}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return

    setIsDeleting(true)
    try {
      await apiClient.delete(`/education/${deletingItem.id}`)
      toast.success('교육사항이 성공적으로 삭제되었습니다')
      await mutate()
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : '알 수 없는 오류가 발생했습니다'

      toast.error(`교육사항 삭제에 실패했습니다: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="교육 관리"
        description="교육사항을 추가/수정/삭제합니다"
        action={
          <Button variant="neon" size="default" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />
            새 교육 추가
          </Button>
        }
      />

      {isLoading ? (
        <EducationTableSkeleton />
      ) : education && education.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-cyan-800] hover:bg-[--color-neon-cyan-500]/5">
                <TableHead className="text-[--color-neon-cyan-600]">교육기관</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">기간</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">설명</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">정렬</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-600]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {education.sort((a, b) => a.sort_order - b.sort_order).map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-[--color-neon-cyan-900] transition-colors hover:bg-[--color-neon-cyan-500]/5"
                >
                  <TableCell className="text-[--color-neon-cyan-300]">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-4 text-[--color-neon-cyan-600]" />
                      {item.institution_name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[--color-neon-cyan-400]">
                    {item.start_year} - {item.end_year || '재학중'}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-[--color-neon-cyan-500]">
                    {item.description}
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
          <GraduationCap className="mx-auto mb-4 size-12 text-[--color-neon-cyan-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-cyan-600]">교육사항이 없습니다</h3>
          <p className="mb-6 font-mono text-sm text-[--color-neon-cyan-700]">새 교육사항을 추가해주세요.</p>
          <Button variant="neon" size="default" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />
            첫 교육 추가
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-cyan-700] !bg-[#0a0a0a] opacity-100 backdrop-blur-none shadow-[0_0_30px_rgba(0,240,255,0.2)] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[--color-neon-cyan-500]">
              {editingItem ? '교육사항 수정' : '새 교육사항 추가'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution_name" className="text-[--color-neon-cyan-600]">
                교육기관명 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="institution_name"
                {...register('institution_name')}
                placeholder="OO대학교 OO학과"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.institution_name && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.institution_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_year" className="text-[--color-neon-cyan-600]">
                시작 연도 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="start_year"
                type="number"
                {...register('start_year', { valueAsNumber: true })}
                placeholder="2020"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.start_year && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.start_year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_year" className="text-[--color-neon-cyan-600]">
                종료 연도
                <span className="ml-2 font-mono text-xs text-[--color-neon-cyan-800]">
                  (선택사항 - 재학중이면 비워두세요)
                </span>
              </Label>
              <Input
                id="end_year"
                type="number"
                {...register('end_year', {
                  setValueAs: (v) => v === '' ? null : parseInt(v, 10)
                })}
                placeholder="2024 (재학중이면 비워두기)"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.end_year && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.end_year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[--color-neon-cyan-600]">
                설명 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={4}
                placeholder="학위, 전공, 성적 등"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.description && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.description.message}</p>
              )}
            </div>

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
                <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.sort_order.message}</p>
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
              <Button type="submit" variant="neon" disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : editingItem ? '수정' : '추가'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="교육사항을 삭제하시겠습니까?"
        description={
          deletingItem
            ? `${deletingItem.institution_name} 항목이 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다.'
        }
        isDeleting={isDeleting}
      />
    </>
  )
}

function EducationTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated]">
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-40 bg-[--color-black-surface]" />
              <Skeleton className="h-12 flex-1 bg-[--color-black-surface]" />
              <Skeleton className="h-8 w-24 bg-[--color-black-surface]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
