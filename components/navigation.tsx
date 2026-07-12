"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ResumeModal } from "@/components/resume-modal"
import { site } from "@/lib/site"
import { scrollToSection } from "@/lib/scroll"

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Achievements", href: "#achievements" },
  { name: "Journey", href: "#journey" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
      
      const sections = navItems.map(item => item.href.slice(1))
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section)
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    scrollToSection(href)
    setIsMobileMenuOpen(false)
  }

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link 
          href="/"
          onClick={scrollToTop}
          className="text-xl font-medium text-foreground tracking-tight hover:opacity-70 transition-opacity duration-300"
        >
          {site.firstName}
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm transition-all duration-300 relative ${
                  activeSection === item.href.slice(1)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
          <li>
            <ResumeModal variant="ghost" label="Resume" triggerClassName="!px-4 !py-2 text-sm" />
          </li>
        </ul>

        {/* Tablet: resume + menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden md:flex lg:hidden items-center gap-3"
        >
          <ResumeModal variant="ghost" label="Resume" triggerClassName="!px-4 !py-2 text-sm" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-border/30 overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-8 gap-6">
              {navItems.map((item, index) => (
                <motion.li 
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-2xl font-light text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                <ResumeModal variant="ghost" label="Resume" triggerClassName="text-2xl font-light !px-0 !py-0 hover:bg-transparent" />
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
