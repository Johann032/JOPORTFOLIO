"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section id="about" className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
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
                About
              </span>
            </div>
          </motion.div>

          {/* Right column - Content */}
          <div className="lg:col-span-9 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] tracking-tight text-balance mb-12">
                Building the future,
                <br />
                <span className="text-muted-foreground">one line at a time.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {"I'm"} a Computer Science Engineering student driven by an insatiable 
                  curiosity for understanding how systems work at their deepest levels.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  My journey into technology began with a simple question: 
                  <span className="text-foreground italic"> {'"How does this actually work?"'}</span> 
                  {" "}— and that question continues to fuel my passion today.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  My interests span across <span className="text-foreground">cybersecurity</span>, 
                  <span className="text-foreground"> software development</span>, 
                  <span className="text-foreground"> reverse engineering</span>, and 
                  <span className="text-foreground"> problem solving</span>.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I believe in learning by doing, constantly pushing myself to tackle 
                  challenges that seem just beyond my reach.
                </p>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ y }}
              className="pt-12 border-t border-border/50"
            >
              <div className="grid grid-cols-3 gap-8">
                {[
                  { label: "Certifications", value: "4+" },
                  { label: "Projects Built", value: "10+" },
                  { label: "Years Learning", value: "3+" },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center md:text-left"
                  >
                    <div className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
