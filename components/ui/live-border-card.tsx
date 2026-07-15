"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface LiveBorderCardProps {
  children: React.ReactNode
  className?: string
}

export function LiveBorderCard({ children, className }: LiveBorderCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const updateSize = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect()
      setSize({ w: width, h: height })
    }
    updateSize()
    
    const observer = new ResizeObserver(() => updateSize())
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const { w, h } = size
  const isReady = w > 0 && h > 0
  const radius = 12

  // Calculate the exact mathematical perimeter of the rounded rectangle
  const perimeter = 2 * (w - 2 * radius) + 2 * (h - 2 * radius) + 2 * Math.PI * radius
  
  // Exactly 25% of the perimeter for the visible loader dash
  const dashLength = perimeter * 0.25

  // Generate a continuous, perfectly uniform SVG path string (clockwise)
  const pathData = isReady 
    ? `M ${radius} 0 L ${w - radius} 0 A ${radius} ${radius} 0 0 1 ${w} ${radius} L ${w} ${h - radius} A ${radius} ${radius} 0 0 1 ${w - radius} ${h} L ${radius} ${h} A ${radius} ${radius} 0 0 1 0 ${h - radius} L 0 ${radius} A ${radius} ${radius} 0 0 1 ${radius} 0 Z`
    : ""

  return (
    <div 
      ref={containerRef}
      className={cn(
        "group relative bg-[#111111] rounded-[12px] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
        className
      )}
    >
      {/* 
        Live Loading Border Engine
        Using a raw <path> ensures the stroke-dashoffset interpolation never distorts or stutters at the corners.
      */}
      <svg 
        className="absolute inset-0 pointer-events-none" 
        style={{ overflow: "visible", width: "100%", height: "100%" }}
      >
        {isReady && (
          <>
            {/* Static Base Border */}
            <path 
              d={pathData}
              fill="none" 
              stroke="#2A2A2A" 
              strokeWidth="1"
              className="transition-colors duration-300 group-hover:stroke-[#333333]"
            />
            
            {/* Live Loading Tracer */}
            <motion.path 
              d={pathData}
              fill="none" 
              stroke="white" 
              strokeWidth="2"
              strokeDasharray={`${dashLength} ${perimeter}`}
              animate={{ strokeDashoffset: [perimeter, 0] }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity }}
              style={{ strokeLinecap: "round" }}
            />
          </>
        )}
      </svg>

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
