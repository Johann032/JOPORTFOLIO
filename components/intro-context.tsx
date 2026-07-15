"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Intro } from "./intro"
import { AnimatePresence } from "framer-motion"

type IntroContextType = {
  isIntroComplete: boolean
  isMounted: boolean
  isIntroSkipped: boolean
  setIntroComplete: (val: boolean) => void
}

const IntroContext = createContext<IntroContextType | undefined>(undefined)

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [isIntroComplete, setIntroComplete] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isIntroSkipped, setIsIntroSkipped] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (hasSeenIntro || prefersReducedMotion) {
      setIntroComplete(true)
      setIsIntroSkipped(true)
    } else {
      setIntroComplete(false)
      setIsIntroSkipped(false)
    }
  }, [])

  const handleIntroComplete = () => {
    setIntroComplete(true)
    sessionStorage.setItem("hasSeenIntro", "true")
  }

  // To prevent hydration mismatch, we don't render until mounted.
  // We can just render children directly if we're not mounted, but styles might flash.
  // Actually, rendering children immediately with isIntroComplete=true is safest for SSR.
  
  return (
    <IntroContext.Provider value={{ isIntroComplete, isMounted, isIntroSkipped, setIntroComplete }}>
      {isMounted && (
        <AnimatePresence>
          {!isIntroComplete && <Intro onComplete={handleIntroComplete} />}
        </AnimatePresence>
      )}
      {children}
    </IntroContext.Provider>
  )
}

export function useIntro() {
  const context = useContext(IntroContext)
  if (context === undefined) {
    throw new Error("useIntro must be used within an IntroProvider")
  }
  return context
}
