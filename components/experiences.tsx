"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Experiences({ experiences }: { experiences: any[] }) {
  if (!experiences || experiences.length === 0) return null

  return (
    <section id="experiences" className="py-20 md:py-32 lg:py-48 px-4 sm:px-6 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase">
            Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight tracking-tight">
            Engineering Journey
          </h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={exp.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className={cn(
                  "flex flex-col md:flex-row gap-8 lg:gap-16 items-center group",
                  !isEven && "md:flex-row-reverse"
                )}
              >
                {/* Image Side */}
                <motion.div
                  className="w-full md:w-1/2 relative"
                  whileHover={{ scale: 1.03, rotateY: isEven ? -3 : 3, rotateX: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ perspective: 1000 }}
                >
                  <Link href={`/experiences/${exp.slug}`} className="block overflow-hidden rounded-[16px] aspect-video md:aspect-[4/3] bg-[#111111] relative border border-[#2A2A2A] shadow-2xl transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500 z-10" />
                    <img
                      src={exp.heroImage}
                      alt={exp.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                  </Link>
                </motion.div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-muted-foreground uppercase tracking-wider">
                      <span>{exp.date}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span>{exp.location}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span className="text-white/80">{exp.category}</span>
                    </div>

                    <Link href={`/experiences/${exp.slug}`} className="block">
                      <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 hover:text-white/80 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-lg lg:text-xl text-[#A6A6A6] font-medium mb-6">
                        {exp.organizer}
                      </p>
                    </Link>

                    <p className="text-base lg:text-lg text-muted-foreground leading-relaxed line-clamp-3">
                      {exp.subtitle}
                    </p>

                    <div className="pt-6">
                      <Link
                        href={`/experiences/${exp.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white hover:text-white/70 transition-colors"
                      >
                        Explore Experience <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
