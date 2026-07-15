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
  const [hasAgreed, setHasAgreed] = useState(false)

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

  // Reset agreement state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setHasAgreed(false), 300)
    }
  }, [open])

  const handleDownload = () => {
    if (!hasAgreed) return
    
    // Trigger download programmatically
    const link = document.createElement("a")
    link.href = site.resumePath
    link.download = site.resumeFileName || "resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setOpen(false)
  }

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
                "border border-border bg-card shadow-2xl",
                "h-[100dvh] sm:h-auto sm:max-w-[560px]",
                "rounded-none sm:rounded-[12px]"
              )}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center text-foreground border border-border/50 shadow-sm">
                    <FileText size={22} className="opacity-80" />
                  </div>
                  <div>
                    <h2
                      id="resume-modal-title"
                      className="text-xl font-semibold text-foreground tracking-tight"
                    >
                      Resume Access Notice
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {site.name}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] border border-border"
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
                  className="px-6 py-6 sm:px-8 sm:py-8"
                >
                  <div className="space-y-6">
                    <p className="text-base text-foreground/90 leading-relaxed font-medium">
                      This resume is provided solely for professional recruitment and evaluation purposes.
                    </p>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        By downloading this document, you agree that you will not:
                      </p>
                      <ul className="space-y-2.5">
                        {["Redistribute or publish this resume.", "Modify or misrepresent its contents.", "Use the information for purposes unrelated to recruitment."].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2 shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 text-sm text-muted-foreground leading-relaxed italic">
                      This document contains personal and professional information and is intended only for the individual downloading it.
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="pt-2">
                      <label 
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none",
                          hasAgreed 
                            ? "bg-foreground/5 border-foreground/20 shadow-sm" 
                            : "bg-secondary/20 border-border/30 hover:border-border/60 hover:bg-secondary/40"
                        )}
                      >
                        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                          <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={hasAgreed}
                            onChange={(e) => setHasAgreed(e.target.checked)}
                          />
                          <div className="w-5 h-5 rounded border-2 border-muted-foreground/40 peer-checked:border-white peer-checked:bg-white flex items-center justify-center transition-all duration-200">
                            <motion.svg 
                              initial={false}
                              animate={{ opacity: hasAgreed ? 1 : 0, scale: hasAgreed ? 1 : 0.5 }}
                              className="w-3.5 h-3.5 text-black" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="3.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </motion.svg>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-foreground/90">
                          I have read and agree to the Resume Access Notice.
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-8 flex items-center gap-3 pt-6 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 btn-premium-secondary min-h-[48px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={!hasAgreed}
                      className={cn(
                        "flex-1",
                        hasAgreed
                          ? "btn-premium-primary min-h-[48px]"
                          : "inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[12px] text-sm font-medium bg-secondary text-muted-foreground border border-border cursor-not-allowed opacity-60 min-h-[48px]"
                      )}
                    >
                      <Download size={16} />
                      Agree & Download
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
