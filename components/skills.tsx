"use client"

import { motion } from "framer-motion"
import { Shield, Code, Terminal, Lightbulb } from "lucide-react"

const skillCategories = [
  {
    title: "Cybersecurity",
    description: "Protecting systems and understanding vulnerabilities",
    icon: Shield,
    skills: ["Network Security", "Penetration Testing", "Cryptography", "Threat Analysis", "OSINT"],
  },
  {
    title: "Development",
    description: "Building robust and scalable applications",
    icon: Code,
    skills: ["Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL"],
  },
  {
    title: "Tools & Systems",
    description: "Mastering the tools of the trade",
    icon: Terminal,
    skills: ["Git", "Linux", "Docker", "Wireshark", "Burp Suite", "VS Code"],
  },
  {
    title: "Problem Solving",
    description: "Analytical thinking and creative solutions",
    icon: Lightbulb,
    skills: ["Data Structures", "Algorithms", "CTF Challenges", "System Design", "Debugging"],
  },
]

export function Skills() {
  return (
    <section id="skills" className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--secondary)_0%,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
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
                Skills
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mt-4 leading-tight">
                What I work with
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                A curated set of tools and technologies {"I've"} developed proficiency in through hands-on projects.
              </p>
            </div>
          </motion.div>

          {/* Right column - Skills grid */}
          <div className="lg:col-span-9">
            <div className="grid md:grid-cols-2 gap-6">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="group h-full p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-border transition-all duration-500 hover:bg-card">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <category.icon className="w-5 h-5 text-foreground" />
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {category.description}
                    </p>
                    
                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 text-xs bg-secondary/50 text-muted-foreground rounded-full hover:bg-secondary hover:text-foreground transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
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
