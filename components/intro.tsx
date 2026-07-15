"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"

const premiumEasing = [0.16, 1, 0.3, 1]

export function Intro({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 4200)
    
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <>
      <style>{`
        @keyframes sweep {
          0% { background-position: -100% 0; }
          75% { background-position: 200% 0; }
          100% { background-position: 200% 0; }
        }
        .swoosh-layer {
          background-image: linear-gradient(105deg, transparent 40%, #ffffff 50%, transparent 60%);
          background-size: 50% 100%;
          background-repeat: no-repeat;
          background-position: -100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 0 2px rgba(255,255,255,1));
          animation: sweep 1.5s ease-in-out 2 forwards;
          animation-delay: 1.0s;
        }
        .trail-layer {
          background-image: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%);
          background-size: 80% 100%;
          background-repeat: no-repeat;
          background-position: -100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: sweep 1.5s ease-out 2 forwards;
          animation-delay: 1.0s;
        }
      `}</style>

      <motion.div 
        className="fixed inset-0 z-[100] bg-[#030303] flex items-center justify-center overflow-hidden pointer-events-none"
        exit={{ opacity: 0, transition: { duration: 0.8, ease: premiumEasing } }}
      >
        {/* Central Identity Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
          className="relative text-4xl sm:text-6xl md:text-8xl lg:text-[8rem] font-bold tracking-[0.2em] uppercase text-white whitespace-nowrap flex items-center justify-center"
        >
          {/* Base Layer (Solid White) */}
          CH3RI4N

          {/* The Full Height Enlightening Swoosh */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none swoosh-layer">
            CH3RI4N
          </div>

          {/* The Full Height Subtle Metallic Reflection */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none trail-layer">
            CH3RI4N
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
