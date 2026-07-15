"use client"

import { motion } from "framer-motion"
import { LiveBorderCard } from "@/components/ui/live-border-card"

const projectsList = [
  {
    title: "SentryXAI",
    status: "Currently in Development",
    description: "An enterprise-grade Security Operations Center (SOC) dashboard designed to enhance threat detection, incident analysis, and security monitoring through intelligent automation and real-time analytics.",
    tech: ["Python", "React", "TypeScript", "TensorFlow", "PostgreSQL"]
  }
]

export function Projects() {
  return (
    <section id="projects" className="py-20 md:py-32 lg:py-48 px-4 sm:px-6 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left column - Label */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-3"
          >
            <div className="lg:sticky lg:top-32">
              <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase">
                Projects
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight tracking-tight">
                Selected Work
              </h2>
            </div>
          </motion.div>

          {/* Right column - Vertical List */}
          <div className="lg:col-span-9 space-y-8">
            {projectsList.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <LiveBorderCard className="p-6 sm:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8 items-start w-full">
                  <div className="w-full space-y-6 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight group-hover:text-white transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.status && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-medium text-muted-foreground bg-secondary/30 border border-border rounded-full uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          {project.status}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-4">
                      {project.tech.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-mono bg-secondary/50 border border-border text-muted-foreground rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </LiveBorderCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
