"use client"

import { motion } from "framer-motion"
import { Linkedin, Mail, ArrowUp } from "lucide-react"
import { site } from "@/lib/site"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="py-16 md:py-24 px-6 relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          {/* Top section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
            <div>
              <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
                {site.name}
              </h3>
              <p className="text-muted-foreground">
                Building secure, elegant software solutions.
              </p>
            </div>
            
            <button
              onClick={scrollToTop}
              className="group w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:border-accent/40 hover:text-accent transition-all duration-300 hover:-translate-y-1"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {currentYear} {site.name}. All rights reserved.
            </p>

            <div className="flex items-center gap-4">

              <a
                href={`mailto:${site.email}`}
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:border-accent/40 hover:text-accent transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
