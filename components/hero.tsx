"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ResumeModal } from "@/components/resume-modal"
import { scrollToSection } from "@/lib/scroll"
import { useIntro } from "@/components/intro-context"
import { ChimeraScene } from "@/components/chimera-scene"
import { HeroMetadata } from "@/components/hero-metadata"

export function Hero() {
  const { isMounted } = useIntro()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  // Smooth scroll-away: scales down and fades out
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  const premiumEasing = [0.16, 1, 0.3, 1]

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Canvas Background Layer */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <ChimeraScene />
      </motion.div>

      {/* Foreground Content */}
      {isMounted && (
        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 w-full max-w-[90rem] mx-auto px-6 sm:px-12 pt-[calc(env(safe-area-inset-top,20px)+4rem)] pb-[calc(env(safe-area-inset-bottom,20px)+2rem)] lg:pt-20 lg:pb-0 min-h-[100dvh] flex flex-col lg:flex-row items-start lg:items-center justify-between pointer-events-none"
        >
          {/* Left/Center Identity (Top on Mobile) */}
          <div className="flex flex-col items-start gap-4 pointer-events-auto lg:ml-12 w-full lg:w-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: premiumEasing }}
              className="text-xs font-mono tracking-widest text-muted-foreground/60 uppercase"
            >
              &gt; WHO_AM_I
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: premiumEasing }}
              className="text-[clamp(3.5rem,10vw,6.5rem)] font-bold text-white tracking-tighter leading-[0.9]"
            >
              CH3RI4N
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: premiumEasing }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground/80 max-w-md leading-relaxed mt-2 sm:mt-6 font-medium text-pretty"
            >
              Building secure systems.<br/>
              Breaking things. Learning endlessly.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: premiumEasing }}
              className="flex flex-wrap items-center gap-6 sm:gap-8 mt-6 sm:mt-10"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("#projects")
                }}
                className="text-xs font-mono tracking-widest text-white border border-white/20 px-6 py-3 hover:bg-white/10 hover:border-white/40 transition-all uppercase"
              >
                &gt; EXPLORE MY WORK
              </a>
              <ResumeModal variant="ghost" label="VIEW RESUME &gt;" triggerClassName="text-xs font-mono tracking-widest text-muted-foreground hover:text-white uppercase !px-0 !py-0 hover:bg-transparent transition-colors" />
            </motion.div>
          </div>

          {/* Right Metadata (Bottom on Mobile) */}
          <div className="pointer-events-auto mt-auto pt-24 lg:pt-0 lg:mr-12 lg:mt-0 w-full lg:w-auto">
            <HeroMetadata />
          </div>
        </motion.div>
      )}

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Scroll Indicator */}
      {isMounted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-10 pointer-events-none"
        >
          <motion.div 
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0" 
          />
        </motion.div>
      )}
    </section>
  )
}
