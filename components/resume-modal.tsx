"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, FileText, X } from "lucide-react"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

type ResumeModalProps = {
  triggerClassName?: string
  variant?: "primary" | "secondary" | "ghost"
  label?: string
}

export function ResumeModal({
  triggerClassName,
  variant = "secondary",
  label = "View Resume",
}: ResumeModalProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const triggerClasses = cn(
    variant === "primary" && "btn-premium-primary",
    variant === "secondary" && "btn-premium-secondary",
    variant === "ghost" && "btn-premium-ghost",
    triggerClassName
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClasses}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FileText size={16} className="opacity-70" />
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              type="button"
              aria-label="Close resume"
              className="absolute inset-0 bg-black/65 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className={cn(
                "relative z-10 flex w-full flex-col overflow-hidden",
                "border border-border/40 bg-background/75 backdrop-blur-2xl shadow-2xl",
                "h-[100dvh] sm:h-[min(90dvh,880px)] sm:max-w-4xl",
                "rounded-none sm:rounded-3xl"
              )}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border/30 px-5 py-4 sm:px-6">
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2
                    id="resume-modal-title"
                    className="text-lg font-semibold text-foreground tracking-tight"
                  >
                    Resume
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {site.name}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <a
                    href={site.resumePath}
                    download={site.resumeFileName}
                    className="btn-premium btn-premium-primary !px-4 !py-2.5 sm:!px-5 sm:!py-3 text-xs sm:text-sm"
                  >
                    <Download size={14} />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain resume-scroll"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 sm:p-6"
                >
                  <div className="rounded-2xl border border-border/30 bg-card/20 overflow-hidden">
                    <iframe
                      src={`${site.resumePath}#toolbar=0&navpanes=0`}
                      title={`${site.name} resume`}
                      className="w-full h-[min(75vh,720px)] sm:h-[min(70vh,680px)] bg-background"
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-4 pb-2">
                    <a
                      href={site.resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline hover:text-foreground transition-colors"
                    >
                      Open PDF in new tab
                    </a>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
