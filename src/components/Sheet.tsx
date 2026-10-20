import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'

/** iOS-style bottom sheet. Drag the handle down or tap outside to close. */
export default function Sheet({
  open, onClose, title, children, footer, tall,
}: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; tall?: boolean }) {
  const drag = useDragControls()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            className={`relative flex w-full max-w-md flex-col rounded-t-[28px] bg-bg shadow-2xl ${tall ? 'h-[94dvh]' : 'max-h-[90dvh]'}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
          >
            <div className="touch-none cursor-grab pt-2.5 pb-1" onPointerDown={(e) => drag.start(e)}>
              <div className="mx-auto h-1.5 w-10 rounded-full bg-muted/40" />
              <div className="flex min-h-11 items-center justify-between px-5 pt-1">
                <div className="text-[17px] font-bold">{title}</div>
                <button aria-label="Close" onClick={onClose} className="press grid h-8 w-8 place-items-center rounded-full bg-card2 text-muted">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">{children}</div>
            {footer && <div className="border-t border-line px-5 pt-3 pb-safe">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
