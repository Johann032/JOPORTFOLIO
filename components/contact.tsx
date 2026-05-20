"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, Linkedin, ArrowUpRight } from "lucide-react"
import { site } from "@/lib/site"

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isFocused, setIsFocused] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <section id="contact" className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--secondary)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left column - Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5"
          >
            <div className="lg:sticky lg:top-32">
              <span className="text-sm text-muted-foreground tracking-widest uppercase">
                Contact
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mt-4 leading-tight">
                {"Let's"} work
                <br />
                together.
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-md">
                Have a project in mind or just want to chat? {"I'd"} love to hear from you.
              </p>
              
              {/* Contact links */}
              <div className="mt-12 space-y-4">
                <a 
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-lg break-all">{site.email}</span>
                </a>
                <a 
                  href={site.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <span className="text-lg">LinkedIn Profile</span>
                </a>
              </div>
              
              {/* Social links */}
              <div className="mt-12 pt-12 border-t border-border/30">
                <p className="text-sm text-muted-foreground mb-6">Connect</p>
                <div className="flex items-center gap-4">
                  <a
                    href={site.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="group w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7"
          >
            <div className="p-8 md:p-12 rounded-3xl bg-card/30 border border-border/30">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label 
                    htmlFor="name" 
                    className={`block text-sm mb-3 transition-colors duration-300 ${
                      isFocused === "name" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setIsFocused("name")}
                    onBlur={() => setIsFocused(null)}
                    className="w-full px-0 py-4 bg-transparent border-0 border-b border-border/50 text-foreground text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-300"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className={`block text-sm mb-3 transition-colors duration-300 ${
                      isFocused === "email" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setIsFocused("email")}
                    onBlur={() => setIsFocused(null)}
                    className="w-full px-0 py-4 bg-transparent border-0 border-b border-border/50 text-foreground text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="message" 
                    className={`block text-sm mb-3 transition-colors duration-300 ${
                      isFocused === "message" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setIsFocused("message")}
                    onBlur={() => setIsFocused(null)}
                    rows={4}
                    className="w-full px-0 py-4 bg-transparent border-0 border-b border-border/50 text-foreground text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn-premium btn-premium-primary group"
                  >
                    Send message
                    <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center group-hover:bg-background/30 transition-colors">
                      <ArrowUpRight size={14} className="text-background" />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
