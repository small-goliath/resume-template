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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { useTechSeminars } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, Mic, ExternalLink } from 'lucide-react'
import type { TechSeminar } from '@/types'

const techSeminarSchema = z.object({
  seminar_name: z.string().min(1, '세미나명을 입력하세요').max(200, '세미나명은 200자 이내로 입력하세요'),
  seminar_url: z.string().optional(),
  year: z.number().min(1900, '1900년 이상이어야 합니다').max(2100, '2100년 이하여야 합니다'),
  sort_order: z.number().min(0, '0 이상이어야 합니다'),
})

type TechSeminarFormData = z.infer<typeof techSeminarSchema>

export default function AdminTechSeminarsPage() {
  const { data: techSeminars, isLoading, mutate } = useTechSeminars()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TechSeminar | null>(null)
  const [deletingItem, setDeletingItem] = useState<TechSeminar | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TechSeminarFormData>({
    resolver: zodResolver(techSeminarSchema),
  })

  const handleAddClick = () => {
    setEditingItem(null)
    reset({
      seminar_name: '',
      seminar_url: '',
      year: new Date().getFullYear(),
      sort_order: techSeminars ? techSeminars.length : 0
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (item: TechSeminar) => {
    setEditingItem(item)
    reset({
      seminar_name: item.seminar_name,
      seminar_url: item.seminar_url || '',
      year: item.year,
      sort_order: item.sort_order
    })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: TechSeminarFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        seminar_url: data.seminar_url || null
      }
      if (editingItem) {
        await apiClient.put(`/tech-seminars/${editingItem.id}`, payload)
        toast.success('세미나가 수정되었습니다')
      } else {
        await apiClient.post('/tech-seminars', payload)
        toast.success('세미나가 추가되었습니다')
      }
      await mutate()
      setIsDialogOpen(false)
      reset()
    } catch (error) {
      toast.error('작업에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setIsDeleting(true)
    try {
      await apiClient.delete(`/tech-seminars/${deletingItem.id}`)
      toast.success('세미나가 삭제되었습니다')
      await mutate()
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (error) {
      toast.error('삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="기술공유 세미나 관리"
        description="기술공유 세미나를 추가/수정/삭제합니다"
        action={
          <Button variant="neon" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />
            새 세미나 추가
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : techSeminars && techSeminars.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-green-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-green-800]">
                <TableHead className="text-[--color-neon-green-600]">세미나명</TableHead>
                <TableHead className="text-[--color-neon-green-600]">링크</TableHead>
                <TableHead className="text-[--color-neon-green-600]">연도</TableHead>
                <TableHead className="text-[--color-neon-green-600]">정렬순서</TableHead>
                <TableHead className="text-right text-[--color-neon-green-600]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {techSeminars.sort((a, b) => b.year - a.year || a.sort_order - b.sort_order).map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-[--color-neon-green-900] hover:bg-[--color-neon-green-500]/5"
                >
                  <TableCell className="text-[--color-neon-green-300]">
                    <div className="flex items-center gap-2">
                      <Mic className="size-4 text-[--color-neon-green-600]" />
                      {item.seminar_name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[--color-neon-green-500]">
                    {item.seminar_url ? (
                      <a
                        href={item.seminar_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        링크
                      </a>
                    ) : (
                      <span className="text-[--color-neon-green-800]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-[--color-neon-green-400]">
                    {item.year}
                  </TableCell>
                  <TableCell className="font-mono text-[--color-neon-green-500]">
                    {item.sort_order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(item)}
                        className="text-[--color-neon-green-500] hover:bg-[--color-neon-green-500]/10"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingItem(item)
                          setIsDeleteDialogOpen(true)
                        }}
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
        <div className="rounded-lg border border-[--color-neon-green-800] bg-[--color-black-elevated] p-12 text-center">
          <Mic className="mx-auto mb-4 size-12 text-[--color-neon-green-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-green-600]">
            세미나가 없습니다
          </h3>
          <Button variant="neon" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />
            첫 세미나 추가
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-green-700] !bg-[#0a0a0a] shadow-[0_0_30px_rgba(16,185,129,0.2)] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[--color-neon-green-500]">
              {editingItem ? '세미나 수정' : '새 세미나 추가'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seminar_name" className="text-[--color-neon-green-600]">
                세미나명 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="seminar_name"
                {...register('seminar_name')}
                className="border-[--color-neon-green-800] bg-[--color-black-surface] text-[--color-neon-green-300]"
                placeholder="예: Next.js 16 완벽 가이드"
              />
              {errors.seminar_name && (
                <p className="text-xs text-[--color-neon-orange-500]">
                  {errors.seminar_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seminar_url" className="text-[--color-neon-green-600]">
                세미나 링크 (선택)
              </Label>
              <Input
                id="seminar_url"
                {...register('seminar_url')}
                className="border-[--color-neon-green-800] bg-[--color-black-surface] text-[--color-neon-green-300]"
                placeholder="https://example.com/seminar"
              />
              {errors.seminar_url && (
                <p className="text-xs text-[--color-neon-orange-500]">
                  {errors.seminar_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-[--color-neon-green-600]">
                연도 <span className="text-[--color-neon-orange-500]">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                className="border-[--color-neon-green-800] bg-[--color-black-surface] text-[--color-neon-green-300]"
              />
              {errors.year && (
                <p className="text-xs text-[--color-neon-orange-500]">
                  {errors.year.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-[--color-neon-green-600]">
                정렬 순서
              </Label>
              <Input
                id="sort_order"
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
                className="border-[--color-neon-green-800] bg-[--color-black-surface] text-[--color-neon-green-300]"
              />
              {errors.sort_order && (
                <p className="text-xs text-[--color-neon-orange-500]">
                  {errors.sort_order.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
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

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="세미나를 삭제하시겠습니까?"
        description={deletingItem ? `${deletingItem.seminar_name} 항목이 삭제됩니다.` : ''}
        isDeleting={isDeleting}
      />
    </>
  )
}
