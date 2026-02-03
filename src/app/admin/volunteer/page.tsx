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
import { useVolunteer } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, Heart } from 'lucide-react'
import type { Volunteer } from '@/types'

const volunteerSchema = z.object({
  organization: z.string().min(1).max(200),
  description: z.string().min(1),
  sort_order: z.number().min(0),
})

type VolunteerFormData = z.infer<typeof volunteerSchema>

export default function AdminVolunteerPage() {
  const { data: volunteer, isLoading, mutate } = useVolunteer()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Volunteer | null>(null)
  const [deletingItem, setDeletingItem] = useState<Volunteer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  })

  const handleAddClick = () => {
    setEditingItem(null)
    reset({ organization: '', description: '', sort_order: volunteer ? volunteer.length : 0 })
    setIsDialogOpen(true)
  }

  const handleEditClick = (item: Volunteer) => {
    setEditingItem(item)
    reset({ organization: item.organization, description: item.description, sort_order: item.sort_order })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: VolunteerFormData) => {
    setIsSubmitting(true)
    try {
      // 연도는 현재 연도로 자동 설정
      const payload = { ...data, year: new Date().getFullYear() }
      if (editingItem) {
        await apiClient.put(`/volunteer/${editingItem.id}`, payload)
        toast.success('봉사활동이 수정되었습니다')
      } else {
        await apiClient.post('/volunteer', payload)
        toast.success('봉사활동이 추가되었습니다')
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
      await apiClient.delete(`/volunteer/${deletingItem.id}`)
      toast.success('봉사활동이 삭제되었습니다')
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
      <AdminHeader title="봉사활동 관리" description="봉사활동을 추가/수정/삭제합니다" action={<Button variant="neon" onClick={handleAddClick} className="gap-2"><Plus className="size-4" />새 봉사활동 추가</Button>} />
      {isLoading ? <Skeleton className="h-64" /> : volunteer && volunteer.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-cyan-800]">
                <TableHead className="text-[--color-neon-cyan-600]">조직</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">설명</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">연도</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-600]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteer.sort((a, b) => b.year - a.year).map((item) => (
                <TableRow key={item.id} className="border-b border-[--color-neon-cyan-900] hover:bg-[--color-neon-cyan-500]/5">
                  <TableCell className="text-[--color-neon-cyan-300]"><div className="flex items-center gap-2"><Heart className="size-4 text-[--color-neon-cyan-600]" />{item.organization}</div></TableCell>
                  <TableCell className="max-w-md truncate text-[--color-neon-cyan-500]">{item.description}</TableCell>
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
          <Heart className="mx-auto mb-4 size-12 text-[--color-neon-cyan-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-cyan-600]">봉사활동이 없습니다</h3>
          <Button variant="neon" onClick={handleAddClick} className="gap-2"><Plus className="size-4" />첫 봉사활동 추가</Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-cyan-700] !bg-[#0a0a0a] shadow-[0_0_30px_rgba(0,240,255,0.2)] sm:max-w-[500px]">
          <DialogHeader><DialogTitle className="text-[--color-neon-cyan-500]">{editingItem ? '봉사활동 수정' : '새 봉사활동 추가'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-[--color-neon-cyan-600]">조직명 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="organization" {...register('organization')} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.organization && <p className="text-xs text-[--color-neon-orange-500]">{errors.organization.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[--color-neon-cyan-600]">설명 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Textarea id="description" {...register('description')} rows={4} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.description && <p className="text-xs text-[--color-neon-orange-500]">{errors.description.message}</p>}
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

      <DeleteConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteConfirm} title="봉사활동을 삭제하시겠습니까?" description={deletingItem ? `${deletingItem.organization} 항목이 삭제됩니다.` : ''} isDeleting={isDeleting} />
    </>
  )
}
