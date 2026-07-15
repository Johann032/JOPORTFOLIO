"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ResumeModal } from "@/components/resume-modal"
import { scrollToSection } from "@/lib/scroll"
import { useIntro } from "@/components/intro-context"

// Scramble text effect for a premium "decryption" feel
const ScrambleText = ({ text, delay }: { text: string, delay: number }) => {
  const [displayText, setDisplayText] = useState("")
  const [isScrambling, setIsScrambling] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*"

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout

    timeout = setTimeout(() => {
      setHasStarted(true)
      setIsScrambling(true)
      let iteration = 0
      
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index]
              }
              return char === " " ? " " : chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        )
        
        if (iteration >= text.length) {
          clearInterval(interval)
          setIsScrambling(false)
        }
        
        iteration += 1 / 2 // Speed of decryption
      }, 30)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, delay])

  if (!hasStarted) return <span className="opacity-0">{text}</span>

  return (
    <span className={isScrambling ? "text-white font-mono" : "text-white transition-colors duration-500"}>
      {displayText}
    </span>
  )
}

export function Hero() {
  const { isMounted, isIntroSkipped } = useIntro()
  const baseDelay = 0
  const containerRef = useRef<HTMLDivElement>(null)

  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Mouse interaction
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 50, stiffness: 100, mass: 1 }
  const spotlightX = useSpring(mouseX, springConfig)
  const spotlightY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 40
    const moveY = ((e.clientY - centerY) / (rect.height / 2)) * 40
    mouseX.set(moveX)
    mouseY.set(moveY)
  }

  const premiumEasing = [0.16, 1, 0.3, 1]

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent perspective-1000"
    >
      {isMounted && (
        <>
          {/* Dynamic Background System */}
          
          {/* 1. Animated Grid that fades in behind the scanner */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2.0, delay: baseDelay, ease: "linear" }}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
            }}
          />

      {/* 2. Interactive Spotlight - Hidden on mobile for performance */}
      <motion.div 
        className="hidden md:flex absolute inset-0 pointer-events-none items-center justify-center mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <motion.div 
          className="w-[1000px] h-[1000px] rounded-full"
          style={{
            x: spotlightX,
            y: spotlightY,
            background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 50%)",
            filter: "blur(60px)"
          }}
        />
      </motion.div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-8"
      >
        {/* Name with Scramble Decrypt Effect */}
        <div className="mb-12 h-6 flex items-center justify-center">
          <span className="text-sm md:text-base font-bold tracking-[0.3em] uppercase">
            <ScrambleText text="JOHANN CHERIAN AJISH" delay={0.1} />
          </span>
        </div>

        {/* Heading with 3D Flip Reveal */}
        <div className="relative text-4xl min-[400px]:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tighter leading-[1.05] mb-12 flex flex-col items-center" style={{ perspective: "1000px" }}>
          
          <div className="overflow-hidden py-2" style={{ transformStyle: "preserve-3d" }}>
            <motion.div 
              initial={{ opacity: 0, rotateX: -90, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: premiumEasing }}
              style={{ transformOrigin: "top" }}
              className="text-white"
            >
              Building secure systems
            </motion.div>
          </div>
          
          <div className="overflow-hidden py-2" style={{ transformStyle: "preserve-3d" }}>
            <motion.div 
              initial={{ opacity: 0, rotateX: -90, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: premiumEasing }}
              style={{ transformOrigin: "top" }}
              className="text-muted-foreground"
            >
              with intelligence.
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: premiumEasing }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-loose text-pretty mb-16 font-medium"
        >
          Computer Science student focused on cybersecurity, AI, and defensive engineering.
        </motion.p>

        {/* Buttons with subtle entry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5, ease: premiumEasing }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("#projects")
            }}
            className="relative group overflow-hidden btn-premium-primary min-h-[48px] w-full sm:w-auto"
          >
            <span className="relative z-10">View Projects</span>
            {/* Minimal metallic sheen */}
            <motion.div 
              className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
              initial={{ left: "-100%" }}
              whileHover={{ left: "200%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </a>
          <div className="w-full sm:w-auto flex flex-col">
            <ResumeModal variant="secondary" triggerClassName="min-h-[48px] w-full" />
          </div>
        </motion.div>
      </motion.div>
        </>
      )}
    </section>
  )
}
