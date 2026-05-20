"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowDown } from "lucide-react"
import { ResumeModal } from "@/components/resume-modal"
import { scrollToSection } from "@/lib/scroll"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle background grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-grid bg-grid-fade opacity-40"
      />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-muted/20 blur-[120px] animate-float" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-muted/15 blur-[100px] animate-float-delayed"
      />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />

      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground tracking-wide max-w-xl mx-auto">
            <span className="hidden sm:inline w-8 h-px bg-border" />
            Computer Science Engineering
            <span className="text-border/80">·</span>
            Cybersecurity
            <span className="text-border/80">·</span>
            Software Development
            <span className="hidden sm:inline w-8 h-px bg-border" />
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-foreground tracking-tight leading-[1.05] text-balance mb-8"
        >
          Johann Cherian
          <br />
          <span className="text-muted-foreground">Ajish</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty mb-12"
        >
          Engineering secure, thoughtful software at the intersection of systems and
          cybersecurity—with a focus on elegant development and disciplined problem solving.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("#contact")
            }}
            className="btn-premium btn-premium-primary group"
          >
            Get in touch
            <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center group-hover:bg-background/30 transition-colors duration-300">
              <ArrowDown size={12} className="text-background rotate-[-90deg]" />
            </span>
          </a>
          <ResumeModal variant="secondary" />
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("#projects")
            }}
            className="btn-premium btn-premium-ghost"
          >
            View my work
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-px h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent origin-top"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
