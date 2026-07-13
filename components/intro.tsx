"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"

export function Intro({ onComplete }: { onComplete: () => void }) {
  // Timeline enforcement
  useEffect(() => {
    // Exactly at 2.8s (2800ms), the intro finishes and unlocks the app.
    const timer = setTimeout(() => {
      onComplete()
    }, 2800)
    
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#030303] flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative flex items-center justify-center">
        
        {/* The Base Container for LayoutId Transition */}
        <motion.div
          layoutId="brand-logo"
          initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase z-10"
        >
          {/* Base Layer: Pure White */}
          <span className="text-white">
            CH3R14N
          </span>

          {/* Masked Shine Layer: Confined strictly to the text */}
          <motion.span
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, transparent 0%, transparent 40%, white 48%, #6EE7FF 50%, white 52%, transparent 60%, transparent 100%)",
              backgroundSize: "200% 100%",
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 16px rgba(110,231,255,0.7))"
            }}
            initial={{ backgroundPosition: "-100% 0" }}
            animate={{ backgroundPosition: "200% 0" }}
            transition={{ duration: 1.2, delay: 1.4, ease: "easeInOut" }}
          >
            CH3R14N
          </motion.span>
        </motion.div>

        {/* The Overarching Physical Sweep */}
        <div className="absolute inset-[-80px] overflow-hidden pointer-events-none z-20">
          {/* Main Anamorphic Flare */}
          <motion.div
            initial={{ left: "-20%", opacity: 0 }}
            animate={{ left: "120%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, delay: 1.4, ease: "easeInOut" }}
            className="absolute top-1/2 bottom-0 w-[2px] h-[120%] -translate-y-1/2 bg-white shadow-[0_0_24px_6px_rgba(110,231,255,0.9)] skew-x-[-18deg]"
          />
          
          {/* Edge glow that follows the flare */}
          <motion.div
            initial={{ left: "-20%", opacity: 0 }}
            animate={{ left: "120%", opacity: [0, 0.5, 0.5, 0] }}
            transition={{ duration: 1.2, delay: 1.4, ease: "easeInOut" }}
            className="absolute top-1/2 bottom-0 w-[60px] h-[120%] -translate-y-1/2 bg-gradient-to-r from-transparent to-accent/40 skew-x-[-18deg] -ml-[60px] mix-blend-screen blur-md"
          />

          {/* Micro Particles trailing the beam */}
          <motion.div
            initial={{ left: "-20%", opacity: 0 }}
            animate={{ left: "120%", opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, delay: 1.45, ease: "easeInOut" }}
            className="absolute top-1/2 -translate-y-1/2 w-[30px] h-[60px] skew-x-[-18deg] -ml-[15px]"
            style={{
              backgroundImage: "radial-gradient(circle, #6EE7FF 1.5px, transparent 1.5px)",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0",
              opacity: 0.4
            }}
          />
        </div>

      </div>
    </motion.div>
  )
}
