"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, Linkedin, ArrowUpRight } from "lucide-react"
import { site } from "@/lib/site"

export function Contact() {
    // Form removed as requested


  return (
    <section id="contact" className="py-32 md:py-48 px-6 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      
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
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mt-4 leading-[1.05] tracking-tight">
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
                className="group flex items-center gap-6 px-8 py-6 rounded-[12px] enterprise-card"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Email Me</span>
                  <span className="text-lg font-mono text-foreground group-hover:text-accent transition-colors duration-300">{site.email}</span>
                </div>
                <ArrowUpRight className="w-5 h-5 ml-4 opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all duration-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
