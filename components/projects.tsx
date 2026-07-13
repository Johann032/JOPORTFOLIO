"use client"

import { motion } from "framer-motion"

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
    <section id="projects" className="py-32 md:py-48 px-6 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      
      <div className="max-w-7xl mx-auto">
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
              <span className="text-sm font-mono text-accent tracking-widest uppercase">
                Projects
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight tracking-tight">
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
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="group enterprise-card p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-start transition-all duration-500">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.status && (
                        <span className="px-3 py-1 text-xs font-mono font-medium text-warning bg-warning/10 border border-warning/20 rounded-full uppercase tracking-wider">
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
