import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

let push: (msg: string) => void = () => {}

/** Show a short confirmation bubble at the top of the screen. */
export const toast = (msg: string) => push(msg)

export function Toaster() {
  const [msg, setMsg] = useState<{ text: string; key: number } | null>(null)

  useEffect(() => {
    push = (text) => setMsg({ text, key: Date.now() })
  }, [])

  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2200)
    return () => clearTimeout(t)
  }, [msg])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center pt-safe">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.key}
            initial={{ y: -40, opacity: 0, scale: 0.9 }}
            animate={{ y: 8, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold shadow-lg"
          >
            <CheckCircle2 size={18} className="text-meal" />
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
