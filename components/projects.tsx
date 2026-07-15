"use client"

import { motion } from "framer-motion"
import { LiveBorderCard } from "@/components/ui/live-border-card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Projects({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) return null

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
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link href={`/projects/${project.slug}`} className="block">
                  <LiveBorderCard className="p-6 sm:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8 items-start w-full transition-transform hover:-translate-y-1">
                    <div className="w-full space-y-6 relative z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-[#2A2A2A] pb-6">
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {project.title}
                          </h3>
                          {project.status && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-medium text-[#A6A6A6] bg-[#111111] border border-[#2A2A2A] rounded-full uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              {project.status}
                            </span>
                          )}
                        </div>
                        <span className="text-[#A6A6A6] group-hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold tracking-wider uppercase">
                          Open Journal <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                      
                      <p className="text-base md:text-lg text-[#A6A6A6] leading-relaxed max-w-2xl">
                        {project.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-[#2A2A2A] mt-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-[#A6A6A6] uppercase tracking-wider">Latest Entry</span>
                          <span className="text-sm text-white truncate font-mono">
                            {project.latestJournal ? project.latestJournal.frontmatter.date : "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-[#A6A6A6] uppercase tracking-wider">Entries</span>
                          <span className="text-sm text-white font-mono">{project.journalCount} Updates</span>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                          <span className="text-xs font-semibold text-[#A6A6A6] uppercase tracking-wider">Progress</span>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="h-1.5 flex-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-white font-mono">{project.progress || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LiveBorderCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
