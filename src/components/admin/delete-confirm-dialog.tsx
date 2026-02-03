'use client'

/**
 * 삭제 확인 다이얼로그
 *
 * 사이버펑크 스타일의 삭제 확인 UI
 */

import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  isDeleting?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = '정말 삭제하시겠습니까?',
  description = '이 작업은 되돌릴 수 없습니다.',
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[--color-neon-orange-600] bg-[--color-black-elevated] shadow-[0_0_30px_rgba(255,107,0,0.3)]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-[--color-neon-orange-500] bg-[--color-neon-orange-500]/10 shadow-[0_0_15px_var(--color-neon-orange-500)]">
              <AlertTriangle className="size-5 text-[--color-neon-orange-500]" />
            </div>
            <DialogTitle className="text-[--color-neon-orange-500]">{title}</DialogTitle>
          </div>
          <DialogDescription className="font-mono text-[--color-neon-cyan-700]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-[--color-neon-cyan-600] hover:bg-[--color-neon-cyan-500]/10 hover:text-[--color-neon-cyan-500]"
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="gap-2 border-[--color-neon-orange-600] bg-[--color-neon-orange-500]/20 text-[--color-neon-orange-500] shadow-[0_0_15px_rgba(255,107,0,0.2)] hover:bg-[--color-neon-orange-500]/30 hover:shadow-[0_0_25px_rgba(255,107,0,0.3)]"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
