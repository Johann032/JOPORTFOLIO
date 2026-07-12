"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const journeyItems = [
  {
    year: "2024",
    title: "Deep Dive into Cybersecurity",
    description: "Started focusing on penetration testing, participating in CTF competitions, and earning industry certifications.",
    highlight: true,
  },
  {
    year: "2023",
    title: "Full-Stack Development",
    description: "Expanded into web development, learning React, Node.js, and building complete applications from scratch.",
    highlight: false,
  },
  {
    year: "2022",
    title: "Started CS Journey",
    description: "Began formal education in Computer Science Engineering, discovering passion for low-level systems.",
    highlight: false,
  },
  {
    year: "2021",
    title: "First Lines of Code",
    description: "Wrote my first Python program. The moment I saw it run successfully, I knew this was my calling.",
    highlight: false,
  },
]

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"])

  return (
    <section id="journey" className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--secondary)_0%,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left column - Label */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-3"
          >
            <div className="lg:sticky lg:top-32">
              <span className="text-sm text-muted-foreground tracking-widest uppercase">
                Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mt-4 leading-tight">
                My path so far
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Every expert was once a beginner. {"Here's"} how my journey in technology has unfolded.
              </p>
            </div>
          </motion.div>

          {/* Right column - Timeline */}
          <div className="lg:col-span-9">
            <div className="relative">
              {/* Animated timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border/30">
                <motion.div 
                  className="w-full bg-gradient-to-b from-foreground to-foreground/20"
                  style={{ height: lineHeight }}
                />
              </div>

              {/* Timeline items */}
              <div className="space-y-16 pl-12">
                {journeyItems.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.15,
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute -left-12 top-0 w-3 h-3 rounded-full border-2 ${
                      item.highlight 
                        ? "bg-foreground border-foreground" 
                        : "bg-background border-muted-foreground/50"
                    }`}>
                      {item.highlight && (
                        <div className="absolute inset-0 rounded-full bg-foreground animate-ping opacity-20" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`${item.highlight ? "" : ""}`}>
                      <div className="flex items-center gap-4 mb-3">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                          item.highlight 
                            ? "bg-foreground text-background" 
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed max-w-lg">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
