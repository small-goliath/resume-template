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
import { useProjects } from '@/lib/hooks/use-portfolio-data'
import { apiClient } from '@/lib/api-client'
import { Plus, Edit, Trash2, FolderGit2 } from 'lucide-react'
import type { SideProject } from '@/types'

const projectSchema = z.object({
  project_name: z.string().min(1, '프로젝트명을 입력해주세요').max(200),
  project_url: z.string().optional(),
  description: z.string().min(1, '설명을 입력해주세요'),
  status: z.string().min(1, '상태를 입력해주세요').max(50),
  year: z.number().min(1900).max(2100),
  sort_order: z.number().min(0),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function AdminProjectsPage() {
  const { data: projects, isLoading, mutate } = useProjects()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SideProject | null>(null)
  const [deletingItem, setDeletingItem] = useState<SideProject | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: '',
      project_url: '',
      description: '',
      status: '서비스 중',
      year: new Date().getFullYear(),
      sort_order: 0,
    },
  })

  const handleAddClick = () => {
    setEditingItem(null)
    reset({
      project_name: '',
      project_url: '',
      description: '',
      status: '서비스 중',
      year: new Date().getFullYear(),
      sort_order: projects ? projects.length : 0,
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (item: SideProject) => {
    setEditingItem(item)
    reset({
      project_name: item.project_name,
      project_url: item.project_url || '',
      description: item.description,
      status: item.status,
      year: item.year,
      sort_order: item.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (item: SideProject) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        project_name: data.project_name,
        project_url: data.project_url || null,
        description: data.description,
        status: data.status,
        year: data.year,
        sort_order: data.sort_order,
      }

      if (editingItem) {
        await apiClient.put(`/projects/${editingItem.id}`, payload)
        toast.success('프로젝트가 성공적으로 수정되었습니다')
      } else {
        await apiClient.post('/projects', payload)
        toast.success('프로젝트가 성공적으로 추가되었습니다')
      }

      await mutate()
      setIsDialogOpen(false)
      reset()
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message : '알 수 없는 오류가 발생했습니다'
      toast.error(editingItem ? `프로젝트 수정에 실패했습니다: ${errorMessage}` : `프로젝트 추가에 실패했습니다: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setIsDeleting(true)
    try {
      await apiClient.delete(`/projects/${deletingItem.id}`)
      toast.success('프로젝트가 성공적으로 삭제되었습니다')
      await mutate()
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message : '알 수 없는 오류가 발생했습니다'
      toast.error(`프로젝트 삭제에 실패했습니다: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="프로젝트 관리"
        description="사이드프로젝트를 추가/수정/삭제합니다"
        action={
          <Button variant="neon" size="default" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />새 프로젝트 추가
          </Button>
        }
      />

      {isLoading ? (
        <ProjectsTableSkeleton />
      ) : projects && projects.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[--color-neon-cyan-700] bg-[--color-black-elevated] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[--color-neon-cyan-800] hover:bg-[--color-neon-cyan-500]/5">
                <TableHead className="text-[--color-neon-cyan-600]">프로젝트명</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">설명</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">상태</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">연도</TableHead>
                <TableHead className="text-[--color-neon-cyan-600]">정렬</TableHead>
                <TableHead className="text-right text-[--color-neon-cyan-600]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.sort((a, b) => b.year - a.year || a.sort_order - b.sort_order).map((item) => (
                <TableRow key={item.id} className="border-b border-[--color-neon-cyan-900] transition-colors hover:bg-[--color-neon-cyan-500]/5">
                  <TableCell className="text-[--color-neon-cyan-300]">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="size-4 text-[--color-neon-cyan-600]" />
                      {item.project_name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-[--color-neon-cyan-500]">{item.description}</TableCell>
                  <TableCell className="text-[--color-neon-cyan-400]">{item.status}</TableCell>
                  <TableCell className="font-mono text-[--color-neon-cyan-400]">{item.year}</TableCell>
                  <TableCell className="font-mono text-[--color-neon-cyan-600]">{item.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)} className="text-[--color-neon-cyan-500] hover:bg-[--color-neon-cyan-500]/10">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)} className="text-[--color-neon-orange-500] hover:bg-[--color-neon-orange-500]/10">
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
          <FolderGit2 className="mx-auto mb-4 size-12 text-[--color-neon-cyan-700]" />
          <h3 className="mb-2 text-lg font-semibold text-[--color-neon-cyan-600]">프로젝트가 없습니다</h3>
          <p className="mb-6 font-mono text-sm text-[--color-neon-cyan-700]">새 프로젝트를 추가해주세요.</p>
          <Button variant="neon" size="default" onClick={handleAddClick} className="gap-2">
            <Plus className="size-4" />첫 프로젝트 추가
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-[--color-neon-cyan-700] !bg-[#0a0a0a] opacity-100 backdrop-blur-none shadow-[0_0_30px_rgba(0,240,255,0.2)] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[--color-neon-cyan-500]">{editingItem ? '프로젝트 수정' : '새 프로젝트 추가'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project_name" className="text-[--color-neon-cyan-600]">프로젝트명 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="project_name" {...register('project_name')} placeholder="프로젝트 이름" className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.project_name && <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.project_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_url" className="text-[--color-neon-cyan-600]">프로젝트 URL <span className="ml-2 font-mono text-xs text-[--color-neon-cyan-800]">(선택사항)</span></Label>
              <Input id="project_url" {...register('project_url')} placeholder="https://..." className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[--color-neon-cyan-600]">설명 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Textarea id="description" {...register('description')} rows={4} placeholder="프로젝트 설명" className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.description && <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[--color-neon-cyan-600]">상태 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="status" {...register('status')} placeholder="서비스 중, 개발 완료, 개발 중, 중단" className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.status && <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.status.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-[--color-neon-cyan-600]">연도 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="year" type="number" {...register('year', { valueAsNumber: true })} placeholder="2024" className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.year && <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.year.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-[--color-neon-cyan-600]">정렬 순서 <span className="text-[--color-neon-orange-500]">*</span></Label>
              <Input id="sort_order" type="number" {...register('sort_order', { valueAsNumber: true })} placeholder="0" className="border-[--color-neon-cyan-800] bg-[--color-black-surface] text-[--color-neon-cyan-300]" />
              {errors.sort_order && <p className="font-mono text-xs text-[--color-neon-orange-500]">{errors.sort_order.message}</p>}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="text-[--color-neon-cyan-600] hover:bg-[--color-neon-cyan-500]/10">취소</Button>
              <Button type="submit" variant="neon" disabled={isSubmitting}>{isSubmitting ? '저장 중...' : editingItem ? '수정' : '추가'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="프로젝트를 삭제하시겠습니까?"
        description={deletingItem ? `${deletingItem.project_name} 항목이 영구적으로 삭제됩니다.` : '이 작업은 되돌릴 수 없습니다.'}
        isDeleting={isDeleting}
      />
    </>
  )
}

function ProjectsTableSkeleton() {
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
