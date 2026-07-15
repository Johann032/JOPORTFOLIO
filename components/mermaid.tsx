"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"
import { cn } from "@/lib/utils"

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    fontFamily: "var(--font-geist-sans)",
    primaryColor: "#111111",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#2A2A2A",
    lineColor: "#E5E5E5",
    secondaryColor: "#080808",
    tertiaryColor: "#1A1A1A",
  },
})

export function MermaidDiagram({ chart, className }: { chart: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(2)}`, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      })
    }
  }, [chart])

  return (
    <div 
      className={cn("flex justify-center p-8 bg-[#030303] border border-[#2A2A2A] rounded-xl my-8", className)} 
      ref={containerRef}
    />
  )
}
