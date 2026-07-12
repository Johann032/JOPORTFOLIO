"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Lock } from "lucide-react"

const projects = [
  {
    title: "SentryXai",
    description: "SentryXai is a professional AI-integrated Security Operations Center (SOC) dashboard designed to enhance threat detection, incident analysis, and security monitoring through intelligent automation and real-time analytics.",
    tags: ["AI / ML", "SOC", "Threat Intelligence", "SIEM", "Python", "React"],
    status: "in-development",
    image: null,
  }
]

export function Projects() {
  return (
    <section id="projects" className="py-32 md:py-48 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
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
              <span className="text-sm text-muted-foreground tracking-widest uppercase">
                Projects
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mt-4 leading-tight">
                What {"I've"} been building
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                A showcase of projects that demonstrate my skills and interests.
              </p>
            </div>
          </motion.div>

          {/* Right column - Projects grid */}
          <div className="lg:col-span-9">
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={index === 1 ? "md:translate-y-12" : ""}
                >
                  <div className="group h-full rounded-2xl bg-card/30 border border-border/30 hover:border-border/60 overflow-hidden transition-all duration-500 hover:bg-card/50">
                    {/* Project image placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {project.status === "in-development" ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center border border-border/20">
                              <Lock className="w-5 h-5 text-foreground/60" />
                            </div>
                            <span className="text-xs text-foreground/60 tracking-wide font-medium bg-background/30 px-3 py-1.5 rounded-full border border-border/10">Currently in Development</span>
                          </div>
                        ) : (
                          <div className="text-5xl font-bold text-foreground/5">
                            {project.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        {project.status === "live" && (
                          <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center">
                            <ArrowUpRight className="w-6 h-6 text-background" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {project.title}
                        </h3>
                        {project.status === "live" && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-xs bg-secondary/50 text-muted-foreground rounded-full"
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
      </div>
    </section>
  )
}
