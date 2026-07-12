"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, Linkedin, ArrowUpRight } from "lucide-react"
import { site } from "@/lib/site"

export function Contact() {
    // Form removed as requested


  return (
    <section id="contact" className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--secondary)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-12 text-center flex flex-col items-center"
          >
            <span className="text-sm text-muted-foreground tracking-widest uppercase">
              Contact
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mt-4 leading-tight">
              {"Let's"} work
              <br />
              together.
            </h2>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-md mx-auto">
              Have a project in mind or just want to chat? {"I'd"} love to hear from you.
            </p>
            
            {/* Contact link */}
            <div className="mt-12">
              <a 
                href={`mailto:${site.email}`}
                className="group flex items-center gap-4 px-8 py-5 rounded-full bg-secondary/50 border border-border/50 text-foreground hover:bg-foreground hover:text-background transition-all duration-400 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center group-hover:bg-background/20 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium tracking-wide">{site.email}</span>
                <ArrowUpRight className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
