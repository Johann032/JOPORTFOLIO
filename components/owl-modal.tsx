"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

type OwlModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function OwlModal({ isOpen, onClose }: OwlModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, onClose])

  if (typeof window === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:justify-end lg:pr-[10%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-[600px] flex flex-col max-h-[90dvh] overflow-hidden border border-border/80 bg-[#0a0a0a] shadow-2xl rounded-none sm:rounded-xl"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-6 pb-4 border-b border-border/50">
              <div>
                <h2 className="text-[13px] font-mono text-white/90 tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500/80 rounded-full animate-pulse" />
                  OWL
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 shrink-0 rounded-none bg-secondary/30 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-white transition-all duration-300 border border-border/60"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-8 space-y-8 resume-scroll">
              <div className="text-[13px] text-foreground/80 leading-relaxed font-mono">
                <p>
                  An interactive digital sentinel representing vigilance, observation, and precision — built to explore how cybersecurity turns complex data into focused insight.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
