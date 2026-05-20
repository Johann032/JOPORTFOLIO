"use client"

import { motion } from "framer-motion"
import { Award, ArrowUpRight } from "lucide-react"

const achievements = [
  {
    title: "Google Cybersecurity Certificate",
    issuer: "Google",
    date: "2024",
    description: "Comprehensive cybersecurity fundamentals including network security, incident response, and security tools.",
    status: "completed",
  },
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2024",
    description: "Foundation-level understanding of AWS Cloud services and architecture.",
    status: "completed",
  },
  {
    title: "CompTIA Security+",
    issuer: "CompTIA",
    date: "Coming Soon",
    description: "Industry-standard cybersecurity certification covering threats, vulnerabilities, and security operations.",
    status: "upcoming",
  },
  {
    title: "HackTheBox Certification",
    issuer: "HackTheBox",
    date: "In Progress",
    description: "Hands-on penetration testing and ethical hacking certification.",
    status: "progress",
  },
]

export function Achievements() {
  return (
    <section id="achievements" className="py-32 md:py-48 px-6 relative">
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
                Achievements
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mt-4 leading-tight">
                Certifications & Recognition
              </h2>
            </div>
          </motion.div>

          {/* Right column - Achievements list */}
          <div className="lg:col-span-9">
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="group p-6 md:p-8 rounded-2xl bg-card/30 border border-border/30 hover:border-border/60 hover:bg-card/50 transition-all duration-500">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                          <Award className="w-5 h-5 text-foreground" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                            {achievement.title}
                          </h3>
                          <span className={`inline-flex w-fit text-xs px-2.5 py-1 rounded-full ${
                            achievement.status === "completed" 
                              ? "bg-foreground/10 text-foreground" 
                              : achievement.status === "progress"
                              ? "bg-muted text-muted-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}>
                            {achievement.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {achievement.issuer}
                        </p>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex-shrink-0 hidden md:block">
                        <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </div>
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
