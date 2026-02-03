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
import { useInternships } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react'
import type { Internship } from '@/types'

const internshipSchema = z.object({
  company: z.string().min(1).max(200),
  description: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  sort_order: z.number().min(0),
})

type InternshipFormData = z.infer<typeof internshipSchema>

export default function AdminInternshipsPage() {
  const { data: internships, isLoading, mutate } = useInternships()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Internship | null>(null)
  const [deletingItem, setDeletingItem] = useState<Internship | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InternshipFormData>({
    resolver: zodResolver(internshipSchema),
  })

  const handleAddClick = () => {
    setEditingItem(null)
    reset({ company: '', description: '', start_date: '', end_date: '', sort_order: internships ? internships.length : 0 })
    setIsDialogOpen(true)
  }

  const handleEditClick = (item: Internship) => {
    setEditingItem(item)
    reset({ company: item.company, description: item.description, start_date: item.start_date, end_date: item.end_date, sort_order: item.sort_order })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: InternshipFormData) => {
    setIsSubmitting(true)
    try {
      if (editingItem) {
        await apiClient.put(`/internships/${editingItem.id}`, data)
        toast.success('인턴십이 수정되었습니다')
      } else {
        await apiClient.post('/internships', data)
        toast.success('인턴십이 추가되었습니다')
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
      await apiClient.delete(`/internships/${deletingItem.id}`)
      toast.success('인턴십이 삭제되었습니다')
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
      <AdminHeader title="인턴십 관리" description="인턴십 경험을 추가/수정/삭제합니다" action={<Button variant="neon" onClick={handleAddClick} className="gap-2"><Plus className="size-4" />새 인턴십 추가</Button>} />
      {isLoading ? <Skeleton className="h-64" /> : internships && internships.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-cyan-800]">
                <TableHead className="text-[--color-neon-cyan-600]">회사</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">기간</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">설명</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-600]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internships.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()).map((item) => (
                <TableRow key={item.id} className="border-b border-[--color-neon-cyan-900] hover:bg-[--color-neon-cyan-500]/5">
                  <TableCell className="text-[--color-neon-cyan-300]"><div className="flex items-center gap-2"><Briefcase className="size-4 text-[--color-neon-cyan-600]" />{item.company}</div></TableCell>
                  <TableCell className="font-mono text-[--color-neon-cyan-400]">{item.start_date} ~ {item.end_date}</TableCell>
                  <TableCell className="max-w-md truncate text-[--color-neon-cyan-500]">{item.description}</TableCell>
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
          <Briefcase className="mx-auto mb-4 size-12 text-[--color-neon-cyan-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-cyan-600]">인턴십이 없습니다</h3>
          <Button variant="neon" onClick={handleAddClick} className="gap-2"><Plus className="size-4" />첫 인턴십 추가</Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-cyan-700] !bg-[#0a0a0a] shadow-[0_0_30px_rgba(0,240,255,0.2)] sm:max-w-[500px]">
          <DialogHeader><DialogTitle className="text-[--color-neon-cyan-500]">{editingItem ? '인턴십 수정' : '새 인턴십 추가'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-[--color-neon-cyan-600]">회사명 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="company" {...register('company')} className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.company && <p className="text-xs text-[--color-neon-orange-500]">{errors.company.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-[--color-neon-cyan-600]">시작일 (YYYY-MM-DD) <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="start_date" {...register('start_date')} placeholder="2024-01-01" className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.start_date && <p className="text-xs text-[--color-neon-orange-500]">{errors.start_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-[--color-neon-cyan-600]">종료일 (YYYY-MM-DD) <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="end_date" {...register('end_date')} placeholder="2024-06-30" className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.end_date && <p className="text-xs text-[--color-neon-orange-500]">{errors.end_date.message}</p>}
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

      <DeleteConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteConfirm} title="인턴십을 삭제하시겠습니까?" description={deletingItem ? `${deletingItem.company} 항목이 삭제됩니다.` : ''} isDeleting={isDeleting} />
    </>
  )
}
