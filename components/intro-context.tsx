"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Intro } from "./intro"

type IntroContextType = {
  isIntroComplete: boolean
  setIntroComplete: (val: boolean) => void
}

const IntroContext = createContext<IntroContextType | undefined>(undefined)

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // If the user has already seen it, we could theoretically store this in localStorage, 
  // but for the sake of the cinematic experience requested, we'll run it once per session/load.
  const [isIntroComplete, setIntroComplete] = useState(false)

  return (
    <IntroContext.Provider value={{ isIntroComplete, setIntroComplete }}>
      {/* Intro Overlay */}
      {!isIntroComplete && <Intro onComplete={() => setIntroComplete(true)} />}
      
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
