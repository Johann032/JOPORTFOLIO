"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface LiveBorderCardProps {
  children: React.ReactNode
  className?: string
}

export function LiveBorderCard({ children, className }: LiveBorderCardProps) {
  return (
    <div 
      className={cn(
        "group relative bg-[#111111] rounded-[12px] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
        className
      )}
    >
      {/* Layer 1: Static Base Border */}
      <div 
        className="absolute inset-0 rounded-[12px] border border-[#2A2A2A] transition-colors duration-300 group-hover:border-[#333333]" 
      />

      {/* Layer 2 & 3: White Border with Animated GPU Mask */}
      <div 
        className="absolute inset-0 rounded-[12px] border border-white animate-mask-sweep pointer-events-none" 
      />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
