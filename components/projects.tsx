"use client"

import { motion } from "framer-motion"
import { LiveBorderCard } from "@/components/ui/live-border-card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ChevronRight, CheckCircle2 } from "lucide-react"

function StaticBorderCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div 
      className={cn(
        "group relative bg-[#111111] rounded-[12px] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
        className
      )}
    >
      <div 
        className="absolute inset-0 rounded-[12px] border border-[#2A2A2A] transition-colors duration-300 group-hover:border-[#333333]" 
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}

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
            {projects.map((project, index) => {
              const isFinished = project.progress === 100
              const CardComponent = isFinished ? StaticBorderCard : LiveBorderCard
              
              return (
                <Link href={`/projects/${project.slug}`} key={project.slug} className="block w-full cursor-pointer z-50 relative">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <CardComponent className="p-6 sm:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8 items-start w-full">
                      <div className="w-full space-y-6 relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-[#2A2A2A] pb-6">
                          <div className="flex items-center gap-4">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                              {project.title}
                              {isFinished && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs tracking-widest uppercase font-mono mt-1 sm:mt-0">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                </span>
                              )}
                            </h3>
                          </div>
                          <span className="text-[#A6A6A6] group-hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold tracking-wider uppercase">
                            Open Journal <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                        
                        <p className="text-base md:text-lg text-[#A6A6A6] leading-relaxed max-w-2xl">
                          {project.description}
                        </p>
                      </div>
                    </CardComponent>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

