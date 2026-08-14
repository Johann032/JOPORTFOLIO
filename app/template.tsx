"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <>
      {/* Cinematic Transition Layer - A subtle platinum/dark sweep */}
      <motion.div
        className="fixed inset-0 z-[100] bg-[#0a0a0a] border-b border-white/5 pointer-events-none"
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      
      {/* Page Content Depth Transition */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </>
  )
}
