"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { site } from "@/lib/site"

export function Contact() {
    // Form removed as requested


  return (
    <section id="contact" className="py-20 md:py-32 lg:py-48 px-4 sm:px-6 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-12 text-center flex flex-col items-center"
          >
            <span className="text-sm text-muted-foreground tracking-widest uppercase">
              Contact
            </span>
            <h2 className="text-4xl min-[400px]:text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mt-4 leading-[1.05] tracking-tight">
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
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 p-6 sm:p-8 rounded-[12px] enterprise-card w-full max-w-sm sm:max-w-md"
              >
                <div className="flex flex-col items-start text-left break-all w-full">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Email Me</span>
                  <span className="text-base sm:text-lg font-mono text-muted-foreground group-hover:text-white transition-colors duration-300">{site.email}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border group-hover:border-white/20 group-hover:bg-[#111111] transition-all duration-300">
                  <ArrowUpRight className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:text-white transition-all duration-300" />
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
