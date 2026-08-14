"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useVelocity, useAnimationFrame } from "framer-motion"
import { useCh3rState, Ch3rMode } from "./ch3r-context"
import { Ch3rAudioProvider, useCh3rAudio } from "./ch3r-audio"

// Desktop specific flight perches using CSS variables to avoid window measuring
const desktopPerches = {
  hero: { x: "calc(100vw - 140px)", y: "140px", scale: 1, opacity: 1, rotate: 0 },
  about: { x: "calc(100vw - 80px)", y: "40vh", scale: 0.9, opacity: 1, rotate: -3 },
  skills: { x: "40px", y: "30vh", scale: 0.85, opacity: 1, rotate: 5 },
  experiences: { x: "calc(100vw + 100px)", y: "50vh", scale: 0.8, opacity: 0, rotate: -15 }, // leaves screen
  projects: { x: "calc(100vw - 100px)", y: "calc(100vh - 180px)", scale: 0.9, opacity: 1, rotate: -2 },
  contact: { x: "calc(100vw - 150px)", y: "60vh", scale: 1, opacity: 1, rotate: 0 },
  intro: { x: "calc(100vw - 140px)", y: "-100px", scale: 0.9, opacity: 0, rotate: 0 },
  mobile_fallback: { x: "calc(100vw - 80px)", y: "100px", scale: 0.7, opacity: 1, rotate: 0 }
}

const mobilePerches = {
  hero: { x: "calc(100vw - 80px)", y: "100px", scale: 0.7, opacity: 1, rotate: 0 },
  about: { x: "calc(100vw - 60px)", y: "30vh", scale: 0.6, opacity: 1, rotate: -2 },
  skills: { x: "20px", y: "20vh", scale: 0.6, opacity: 1, rotate: 3 },
  experiences: { x: "calc(100vw + 50px)", y: "40vh", scale: 0.5, opacity: 0, rotate: -10 },
  projects: { x: "calc(100vw - 70px)", y: "calc(100vh - 120px)", scale: 0.65, opacity: 1, rotate: -1 },
  contact: { x: "calc(100vw - 80px)", y: "50vh", scale: 0.7, opacity: 1, rotate: 0 },
  intro: { x: "calc(100vw - 80px)", y: "-100px", scale: 0.6, opacity: 0, rotate: 0 },
}

function Ch3rBody() {
  const { ch3rMode, activeSection } = useCh3rState()
  const { playStartup, playGreeting, playServo } = useCh3rAudio()
  
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [hasIntroduced, setHasIntroduced] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cursor tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lookX = useSpring(mouseX, { damping: 40, stiffness: 300, mass: 0.5 })
  const lookY = useSpring(mouseY, { damping: 40, stiffness: 300, mass: 0.5 })

  // Intro Sequence
  const [introStage, setIntroStage] = useState<"hidden" | "descending" | "settling" | "waving" | "idle">("hidden")

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const isIntroDone = sessionStorage.getItem("ch3r-introduced")
    if (!isIntroDone) {
      setHasIntroduced(false)
      sessionStorage.setItem("ch3r-introduced", "true")
      
      setTimeout(() => { setIntroStage("descending"); playStartup() }, 500)
      setTimeout(() => { setIntroStage("settling") }, 1000)
      setTimeout(() => { playGreeting() }, 1200)
      setTimeout(() => { setIntroStage("waving"); playServo() }, 1500)
      setTimeout(() => { setIntroStage("idle"); setHasIntroduced(true) }, 4000)
    } else {
      setIntroStage("idle")
      setHasIntroduced(true)
    }
  }, [playStartup, playGreeting, playServo])

  // Profile behaviors
  const [isBlinking, setIsBlinking] = useState(false)
  const [scanX, setScanX] = useState(0)

  useEffect(() => {
    if (!hasIntroduced) return
    let timeout: NodeJS.Timeout

    const blink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
      
      let nextBlink = 3000
      if (ch3rMode === "skills") nextBlink = 800 + Math.random() * 1000 // fast blink for analyzing
      else if (ch3rMode === "about") nextBlink = 4000 + Math.random() * 4000 // slow blink relaxed
      else nextBlink = 2000 + Math.random() * 6000

      timeout = setTimeout(blink, nextBlink)
    }
    
    timeout = setTimeout(blink, 1000)
    return () => clearTimeout(timeout)
  }, [hasIntroduced, ch3rMode])

  useEffect(() => {
    // Scanning behavior for skills mode
    if (ch3rMode === "skills" && hasIntroduced) {
      const interval = setInterval(() => {
        setScanX(Math.random() * 10 - 5)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setScanX(0)
    }
  }, [ch3rMode, hasIntroduced])

  // Mouse tracking
  useEffect(() => {
    if (!hasIntroduced || isMobile || ch3rMode === "experiences") return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      // Stop tracking if relaxed or observing (about, projects) unless hovered
      if ((ch3rMode === "about" || ch3rMode === "projects") && !isHovered) {
        mouseX.set(0)
        mouseY.set(0)
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const moveX = Math.max(-10, Math.min(10, (e.clientX - centerX) / 40))
      const moveY = Math.max(-5, Math.min(5, (e.clientY - centerY) / 40))
      
      mouseX.set(moveX)
      mouseY.set(moveY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [hasIntroduced, isMobile, ch3rMode, mouseX, mouseY, isHovered])

  // Flight Physics & Coordinate Management
  const fixedDesktopPerch = { x: "calc(100vw - 120px)", y: "100px", scale: 1, opacity: 1, rotate: 0 }
  const fixedMobilePerch = { x: "calc(100vw - 70px)", y: "80px", scale: 0.7, opacity: 1, rotate: 0 }
  
  // Always sit at the fixed coordinate; the inner container will animate the drop and reveal
  const targetCoordinates = isMobile ? fixedMobilePerch : fixedDesktopPerch
  
  // Intro animation offsets
  const introY = introStage === "hidden" ? -100 : introStage === "descending" ? 10 : 0
  const introOpacity = introStage === "hidden" ? 0 : 1
  const introRotate = introStage === "waving" ? [0, -15, 15, -15, 0] : 0

  return (
    <motion.div
      className="fixed top-0 left-0 z-[60] pointer-events-auto"
      animate={{
        x: targetCoordinates.x,
        y: targetCoordinates.y,
        scale: targetCoordinates.scale,
        opacity: targetCoordinates.opacity,
        rotateZ: targetCoordinates.rotate
      }}
      transition={{
        x: { type: "spring", stiffness: 60, damping: 20, mass: 1 },
        y: { type: "spring", stiffness: 80, damping: 18, mass: 1.2 },
        scale: { duration: 0.5 },
        opacity: { duration: 0.5 },
        rotateZ: { type: "spring", stiffness: 60, damping: 15 }
      }}
    >
      <motion.div
        animate={{ y: introY, rotate: introRotate, opacity: introOpacity }}
        transition={{ 
          y: { type: "spring", stiffness: introStage === "settling" ? 300 : 100, damping: 20 },
          rotate: { duration: 0.5 },
          opacity: { duration: 0.5 }
        }}
      >
        <div 
          className="relative z-50 flex items-center justify-center group"
          ref={containerRef}
          onMouseEnter={() => hasIntroduced && setIsHovered(true)}
          onMouseLeave={() => hasIntroduced && setIsHovered(false)}
          onClick={() => hasIntroduced && setIsClicked(!isClicked)}
          role="button"
          aria-label="CH3R AI Companion"
          tabIndex={0}
        >
          {/* Initial Greeting Bubble */}
          <AnimatePresence>
            {introStage === "waving" && !isClicked && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full mt-4 right-0 md:right-1/2 md:translate-x-1/2 whitespace-nowrap p-3 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <p className="text-sm font-mono text-white font-medium">Hi, there! 👋</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Tooltip */}
          <AnimatePresence>
            {isClicked && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full mt-4 right-0 md:right-1/2 md:translate-x-1/2 min-w-[150px] p-2.5 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-2 px-1">Need something?</p>
                <div className="flex flex-col gap-0.5">
                  <a href="#projects" className="text-sm text-white/80 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors">Projects</a>
                  <a href="#skills" className="text-sm text-white/80 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors">Skills</a>
                  <a href="#about" className="text-sm text-white/80 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors">About Johann</a>
                  <a href="#contact" className="text-sm text-white/80 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors">Contact</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating chassis */}
          <motion.div 
            animate={{ 
              y: hasIntroduced ? ["-3%", "3%", "-3%"] : 0,
              scale: isHovered ? 1.05 : 1
            }}
            transition={{
              y: { duration: ch3rMode === "projects" ? 6 : 4, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 400, damping: 25 }
            }}
            className="relative w-[60px] h-[60px] md:w-[75px] md:h-[75px] lg:w-[90px] lg:h-[90px]"
          >
            {/* Main Body */}
            <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#2a2a2a] via-[#111111] to-black border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ 
                  x: useTransform(lookX, [-10, 10], ["-30%", "30%"]),
                  y: useTransform(lookY, [-5, 5], ["-30%", "30%"])
                }}
              />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[40%] bg-[#050505] rounded-full border border-white/5 shadow-[inset_0_2px_15px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
                
                {/* Eyes */}
                <motion.div 
                  className="flex gap-2 lg:gap-2.5"
                  style={{
                    x: introStage === "descending" ? 0 : ch3rMode === "skills" ? scanX : lookX,
                    y: introStage === "descending" ? 3 : ch3rMode === "projects" ? 3 : lookY
                  }}
                  transition={{ x: { type: "spring", stiffness: 200, damping: 20 } }}
                >
                  <motion.div 
                    className="w-2.5 h-1 md:w-3.5 md:h-1.5 rounded-full bg-[#bde0fe] shadow-[0_0_12px_#bde0fe]"
                    animate={{
                      scaleY: isBlinking ? 0.1 : ch3rMode === "skills" ? 0.8 : 1,
                      scaleX: introStage === "descending" ? 1.2 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  />
                  <motion.div 
                    className="w-2.5 h-1 md:w-3.5 md:h-1.5 rounded-full bg-[#bde0fe] shadow-[0_0_12px_#bde0fe]"
                    animate={{
                      scaleY: isBlinking ? 0.1 : ch3rMode === "skills" ? 0.8 : 1,
                      scaleX: introStage === "descending" ? 1.2 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="absolute -inset-2 md:-inset-3 border border-white/5 rounded-[2rem] md:rounded-[3rem] pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: ch3rMode === "skills" ? 10 : 25, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function CH3RCompanion() {
  return (
    <Ch3rAudioProvider>
      <Ch3rBody />
    </Ch3rAudioProvider>
  )
}
