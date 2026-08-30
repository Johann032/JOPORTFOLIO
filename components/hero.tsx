"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { useIntro } from "@/components/intro-context"
import dynamic from 'next/dynamic'

const OwlScene = dynamic(() => import('@/components/owl-scene').then(mod => mod.OwlScene), {
  ssr: false,
})

export function Hero() {
  const { isMounted } = useIntro()
  const containerRef = useRef<HTMLDivElement>(null)
  const [owlLoaded, setOwlLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  // Smooth scroll-away: scales down and fades out
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  const premiumEasing = [0.16, 1, 0.3, 1]
  
  const [timeStr, setTimeStr] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: '2-digit', minute:'2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Canvas Background Layer with Placeholder */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* The Placeholder - minimal dot silhouette */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: owlLoaded ? 0 : 1 }}
          transition={{ duration: 0.4, ease: premiumEasing }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-8"
        >
          <div 
            className="w-[25vw] h-[35vw] max-w-[180px] max-h-[250px] opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '8px 8px',
              maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)'
            }}
          />
          <div className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
            INITIALIZING
          </div>
        </motion.div>

        {/* The actual 3D Scene - fades in when ready */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: owlLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, ease: premiumEasing }}
          style={{ y, opacity: owlLoaded ? opacity : 0 }}
        >
          <OwlScene onLoaded={() => setOwlLoaded(true)} />
        </motion.div>
      </div>

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

      {/* Ambient Information (Telemetry) */}
      {isMounted && timeStr && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: premiumEasing }}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 flex flex-col items-end pointer-events-none text-right"
        >
          {/* Mobile minimal telemetry */}
          <div className="md:hidden flex flex-col items-end gap-1">
            <div className="text-[10px] font-mono tracking-widest text-white/70">
              {timeStr}
            </div>
            <div className="text-[9px] font-mono tracking-widest text-muted-foreground/50 uppercase">
              KERALA · 28°C
            </div>
          </div>

          {/* Desktop expanded telemetry */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex flex-col items-end mb-4">
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground/40 uppercase mb-1">
                LOCAL TIME
              </div>
              <div className="text-[11px] font-mono tracking-wider text-white/70">
                {timeStr}
              </div>
            </div>

            <div className="w-6 h-[1px] bg-white/10 mb-4" />

            <div className="flex flex-col items-end mb-4">
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground/40 uppercase mb-1">
                KERALA, INDIA
              </div>
              <div className="text-[10px] font-mono tracking-widest text-white/50">
                10.8505° N · 76.2711° E
              </div>
            </div>

            <div className="w-6 h-[1px] bg-white/10 mb-4" />

            <div className="flex flex-col items-end">
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground/40 uppercase mb-1">
                WEATHER
              </div>
              <div className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                28°C · P. CLOUDY
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      {isMounted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-none"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">
            Scroll Down
          </span>
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
