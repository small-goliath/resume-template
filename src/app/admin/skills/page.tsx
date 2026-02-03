'use client'

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
import { useSkills } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, Code2 } from 'lucide-react'
import type { Skill } from '@/types'

const skillSchema = z.object({
  category: z.string().min(1, '카테고리를 입력해주세요').max(100, '카테고리는 100자 이내여야 합니다'),
  skill_name: z.string().min(1, '스킬명을 입력해주세요').max(100, '스킬명은 100자 이내여야 합니다'),
  sort_order: z.number().min(0, '정렬 순서는 0 이상이어야 합니다'),
})

type SkillFormData = z.infer<typeof skillSchema>

export default function AdminSkillsPage() {
  const { data: skills, isLoading, mutate } = useSkills()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Skill | null>(null)
  const [deletingItem, setDeletingItem] = useState<Skill | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      category: '',
      skill_name: '',
      sort_order: 0,
    },
  })

  const handleAddClick = () => {
    setEditingItem(null)
    reset({
      category: '',
      skill_name: '',
      sort_order: skills ? skills.length : 0,
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (item: Skill) => {
    setEditingItem(item)
    reset({
      category: item.category,
      skill_name: item.skill_name,
      sort_order: item.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (item: Skill) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true)
    try {
      if (editingItem) {
        await apiClient.put(`/skills/${editingItem.id}`, data)
        toast.success('스킬이 성공적으로 수정되었습니다')
      } else {
        await apiClient.post('/skills', data)
        toast.success('스킬이 성공적으로 추가되었습니다')
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
          ? `스킬 수정에 실패했습니다: ${errorMessage}`
          : `스킬 추가에 실패했습니다: ${errorMessage}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return

    setIsDeleting(true)
    try {
      await apiClient.delete(`/skills/${deletingItem.id}`)
      toast.success('스킬이 성공적으로 삭제되었습니다')
      await mutate()
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : '알 수 없는 오류가 발생했습니다'

      toast.error(`스킬 삭제에 실패했습니다: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="스킬 관리"
        description="기술 역량을 추가/수정/삭제합니다"
        action={
          <Button variant="neon" size="default" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />
            새 스킬 추가
          </Button>
        }
      />

      {isLoading ? (
        <SkillsTableSkeleton />
      ) : skills && skills.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-cyan-800] hover:bg-[--color-neon-cyan-500]/5">
                <TableHead className="text-[--color-neon-cyan-600]">카테고리</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">스킬명</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">정렬</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-600]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.sort((a, b) => a.category.localeCompare(b.category) || a.sort_order - b.sort_order).map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-[--color-neon-cyan-900] transition-colors hover:bg-[--color-neon-cyan-500]/5"
                >
                  <TableCell className="text-[--color-neon-cyan-400]">{item.category}</TableCell>
                  <TableCell className="text-[--color-neon-cyan-300]">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-[--color-neon-cyan-600]" />
                      {item.skill_name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[--color-neon-cyan-600]">{item.sort_order}</TableCell>
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
          <Code2 className="mx-auto mb-4 size-12 text-[--color-neon-cyan-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-cyan-600]">스킬이 없습니다</h3>
          <p className="mb-6 font-mono text-sm text-[--color-neon-cyan-700]">새 스킬을 추가해주세요.</p>
          <Button variant="neon" size="default" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />
            첫 스킬 추가
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-cyan-700] !bg-[#0a0a0a] opacity-100 backdrop-blur-none shadow-[0_0_30px_rgba(0,240,255,0.2)] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[--color-neon-cyan-500]">
              {editingItem ? '스킬 수정' : '새 스킬 추가'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[--color-neon-cyan-600]">
                카테고리 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="언어, 백엔드, 데이터베이스 등"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.category && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill_name" className="text-[--color-neon-cyan-600]">
                스킬명 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="skill_name"
                {...register('skill_name')}
                placeholder="Python, React, PostgreSQL 등"
                className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]"
              />
              {errors.skill_name && (
                <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.skill_name.message}</p>
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
        title="스킬을 삭제하시겠습니까?"
        description={
          deletingItem
            ? `${deletingItem.skill_name} 항목이 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다.'
        }
        isDeleting={isDeleting}
      />
    </>
  )
}

function SkillsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated]">
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-32 bg-[--color-black-surface]" />
              <Skeleton className="h-12 flex-1 bg-[--color-black-surface]" />
              <Skeleton className="h-8 w-24 bg-[--color-black-surface]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
