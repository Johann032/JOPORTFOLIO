"use client"

import React, { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useCh3rAudio } from "./ch3r-audio"

export function Ch3rEntrance({ children }: { children: React.ReactNode }) {
  const [hasIntroduced, setHasIntroduced] = useState(true) // default true to avoid flash
  const shouldReduceMotion = useReducedMotion()
  const { playStartup, playGreeting, playServo } = useCh3rAudio()
  
  const [stage, setStage] = useState<"hidden" | "descending" | "settling" | "waving" | "idle">("hidden")

  useEffect(() => {
    // Only run on client
    const isIntroDone = sessionStorage.getItem("ch3r-introduced")
    if (!isIntroDone && !shouldReduceMotion) {
      setHasIntroduced(false)
      sessionStorage.setItem("ch3r-introduced", "true")
      
      // Start cinematic timeline
      setTimeout(() => {
        setStage("descending")
        playStartup()
      }, 500)
      
      setTimeout(() => {
        setStage("settling")
      }, 1000)
      
      setTimeout(() => {
        playGreeting()
      }, 1200)

      setTimeout(() => {
        setStage("waving")
        playServo()
      }, 1500)
      
      setTimeout(() => {
        setStage("idle")
        setHasIntroduced(true) // unlock normal interactive behavior
      }, 2000)
    } else {
      setStage("idle")
      setHasIntroduced(true)
    }
  }, [shouldReduceMotion, playStartup, playGreeting, playServo])

  if (shouldReduceMotion) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
        {children}
      </motion.div>
    )
  }

  // Animation variants
  const variants = {
    hidden: { y: -60, opacity: 0, scale: 0.9 },
    descending: { y: 10, opacity: 1, scale: 1.05, transition: { type: "spring", stiffness: 100, damping: 20 } },
    settling: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    waving: { y: 0, opacity: 1, rotate: [0, -15, 15, -15, 0], transition: { duration: 0.5 } },
    idle: { y: 0, opacity: 1, rotate: 0 }
  }

  return (
    <motion.div
      initial="hidden"
      animate={stage}
      variants={variants}
      className="relative"
    >
      {/* Inject stage props to children */}
      {React.cloneElement(children as React.ReactElement, { entranceStage: stage, isIdle: hasIntroduced })}
    </motion.div>
  )
}
