"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"

export type Ch3rMode = "hero" | "about" | "skills" | "experiences" | "projects" | "contact" | ""

type Ch3rContextType = {
  activeSection: string
  ch3rMode: Ch3rMode
}

const Ch3rContext = createContext<Ch3rContextType>({
  activeSection: "",
  ch3rMode: "hero",
})

export const useCh3rState = () => useContext(Ch3rContext)

export function Ch3rProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("")
  const [ch3rMode, setCh3rMode] = useState<Ch3rMode>("hero")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experiences", "projects", "contact"]
      
      let currentSection = "hero"
      
      if (window.scrollY > 100) {
        for (const section of [...sections].reverse()) {
          const element = document.getElementById(section)
          // Add extra offset to detect sections earlier
          if (element && window.scrollY >= element.offsetTop - window.innerHeight / 3) {
            currentSection = section
            break
          }
        }
      }

      setActiveSection(prev => {
        if (prev !== currentSection) return currentSection
        return prev
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    // Initial check
    handleScroll()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Debounce the flight mode change (Wait 500ms before flying)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(() => {
      setCh3rMode(activeSection as Ch3rMode)
    }, 600)
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [activeSection])

  return (
    <Ch3rContext.Provider value={{ activeSection, ch3rMode }}>
      {children}
    </Ch3rContext.Provider>
  )
}
