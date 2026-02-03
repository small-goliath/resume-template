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
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { useAwards } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, Trophy } from 'lucide-react'
import type { Award } from '@/types'

const awardSchema = z.object({
  award_name: z.string().min(1).max(200),
  award_url: z.string().optional(),
  contest_name: z.string().min(1).max(200),
  certificate_image_url: z.string().optional(),
  year: z.number().min(1900).max(2100),
  sort_order: z.number().min(0),
})

type AwardFormData = z.infer<typeof awardSchema>

export default function AdminAwardsPage() {
  const { data: awards, isLoading, mutate } = useAwards()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Award | null>(null)
  const [deletingItem, setDeletingItem] = useState<Award | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AwardFormData>({
    resolver: zodResolver(awardSchema),
  })

  const handleAddClick = () => {
    setEditingItem(null)
    reset({ award_name: '', award_url: '', contest_name: '', certificate_image_url: '', year: new Date().getFullYear(), sort_order: awards ? awards.length : 0 })
    setIsDialogOpen(true)
  }

  const handleEditClick = (item: Award) => {
    setEditingItem(item)
    reset({ award_name: item.award_name, award_url: item.award_url || '', contest_name: item.contest_name, certificate_image_url: item.certificate_image_url, year: item.year, sort_order: item.sort_order })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: AwardFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        award_url: data.award_url || null,
        certificate_image_url: data.certificate_image_url || null
      }
      if (editingItem) {
        await apiClient.put(`/awards/${editingItem.id}`, payload)
        toast.success('수상 내역이 수정되었습니다')
      } else {
        await apiClient.post('/awards', payload)
        toast.success('수상 내역이 추가되었습니다')
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
      await apiClient.delete(`/awards/${deletingItem.id}`)
      toast.success('수상 내역이 삭제되었습니다')
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
      <AdminHeader title="수상 관리" description="수상 내역을 추가/수정/삭제합니다" action={<Button variant="neon" onClick={handleAddClick} className="gap-2"><Plus className="size-4" />새 수상 추가</Button>} />
      {isLoading ? <Skeleton className="h-64" /> : awards && awards.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-cyan-800]">
                <TableHead className="text-[--color-neon-cyan-600]">수상명</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">대회명</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">연도</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-600]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awards.sort((a, b) => b.year - a.year || a.sort_order - b.sort_order).map((item) => (
                <TableRow key={item.id} className="border-b border-[--color-neon-cyan-900] hover:bg-[--color-neon-cyan-500]/5">
                  <TableCell className="text-[--color-neon-cyan-300]"><div className="flex items-center gap-2"><Trophy className="size-4 text-[--color-neon-cyan-600]" />{item.award_name}</div></TableCell>
                  <TableCell className="text-[--color-neon-cyan-400]">{item.contest_name}</TableCell>
                  <TableCell className="font-mono text-[--color-neon-cyan-400]">{item.year}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)} className="text-[--color-neon-cyan-500] hover:bg-[--color-neon-cyan-500]/10"><Edit className="size-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setDeletingItem(item); setIsDeleteDialogOpen(true) }} className="text-[--color-neon-orange-500] hover:bg-[--color-neon-orange-500]/10"><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-[--color-neon-cyan-800] bg-[--color-black-elevated] p-12 text-center">
          <Trophy className="mx-auto mb-4 size-12 text-[--color-neon-cyan-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-cyan-600]">수상 내역이 없습니다</h3>
          <Button variant="neon" onClick={handleAddClick} className="gap-2"><Plus className="size-4" />첫 수상 추가</Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-cyan-700] !bg-[#0a0a0a] shadow-[0_0_30px_rgba(0,240,255,0.2)] sm:max-w-[500px]">
          <DialogHeader><DialogTitle className="text-[--color-neon-cyan-500]">{editingItem ? '수상 수정' : '새 수상 추가'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="award_name" className="text-[--color-neon-cyan-600]">수상명 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="award_name" {...register('award_name')} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.award_name && <p className="text-xs text-[--color-neon-orange-500]">{errors.award_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contest_name" className="text-[--color-neon-cyan-600]">대회명 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="contest_name" {...register('contest_name')} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.contest_name && <p className="text-xs text-[--color-neon-orange-500]">{errors.contest_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificate_image_url" className="text-[--color-neon-cyan-600]">수료증 이미지 URL (선택)</Label>
              <Input id="certificate_image_url" {...register('certificate_image_url')} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.certificate_image_url && <p className="text-xs text-[--color-neon-orange-500]">{errors.certificate_image_url.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="award_url" className="text-[--color-neon-cyan-600]">수상 URL (선택)</Label>
              <Input id="award_url" {...register('award_url')} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-[--color-neon-cyan-600]">연도 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="year" type="number" {...register('year', { valueAsNumber: true })} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.year && <p className="text-xs text-[--color-neon-orange-500]">{errors.year.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-[--color-neon-cyan-600]">정렬 순서</Label>
              <Input id="sort_order" type="number" {...register('sort_order', { valueAsNumber: true })} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>취소</Button>
              <Button type="submit" variant="neon" disabled={isSubmitting}>{isSubmitting ? '저장 중...' : editingItem ? '수정' : '추가'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteConfirm} title="수상 내역을 삭제하시겠습니까?" description={deletingItem ? `${deletingItem.award_name} 항목이 삭제됩니다.` : ''} isDeleting={isDeleting} />
    </>
  )
}
