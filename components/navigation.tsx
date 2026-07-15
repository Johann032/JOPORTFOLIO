"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ResumeModal } from "@/components/resume-modal"
import { site } from "@/lib/site"
import { scrollToSection } from "@/lib/scroll"
import { useIntro } from "@/components/intro-context"

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Journey", href: "#journey" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const { isIntroComplete, isMounted, isIntroSkipped } = useIntro()
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isMobileMenuOpen])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      scrollToSection(href)
    }, 300) // wait for menu animation
  }

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 300)
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: isMounted ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-500 pt-[env(safe-area-inset-top)] pointer-events-auto ${
          isScrolled && !isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link 
            href="/"
            onClick={scrollToTop}
            className="hover:opacity-70 transition-opacity duration-300 flex items-center relative z-[70]"
          >
            {isMounted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "linear" }}
                className="text-xl font-bold text-foreground tracking-[0.2em] uppercase"
              >
                CH3RI4N
              </motion.div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navItems.map((item, index) => (
              <motion.li 
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm transition-all duration-300 relative font-medium ${
                    activeSection === item.href.slice(1)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-accent"
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
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResumeModal variant="ghost" label="Resume" triggerClassName="!px-4 !py-2 text-sm" />
            </motion.li>
          </ul>

          {/* Tablet: resume + menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden md:flex lg:hidden items-center gap-3 relative z-[70]"
          >
            <ResumeModal variant="ghost" label="Resume" triggerClassName="!px-4 !py-2 text-sm" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-3 -mr-3 relative w-12 h-12 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-[2px] bg-foreground block transition-all"
              />
              <motion.span 
                animate={isMobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                className="w-6 h-[2px] bg-foreground block transition-all"
              />
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-[2px] bg-foreground block transition-all"
              />
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground p-3 -mr-3 relative w-12 h-12 flex flex-col justify-center items-center gap-1.5 focus:outline-none z-[70]"
            aria-label="Toggle menu"
          >
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-foreground block transition-all"
            />
            <motion.span 
              animate={isMobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
              className="w-6 h-[2px] bg-foreground block transition-all"
            />
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-foreground block transition-all"
            />
          </button>
        </nav>
      </motion.header>

      {/* Fullscreen Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center lg:hidden"
            style={{ 
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)"
            }}
          >
            <nav className="flex flex-col items-center gap-8 w-full px-6">
              {navItems.map((item, index) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20, transition: { delay: 0 } }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-4xl sm:text-5xl font-light text-foreground hover:text-accent transition-colors duration-300 tracking-tight block"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20, transition: { delay: 0 } }}
                transition={{ delay: navItems.length * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4"
              >
                <ResumeModal 
                  variant="ghost" 
                  label="Resume" 
                  triggerClassName="text-4xl sm:text-5xl font-light text-foreground hover:text-accent tracking-tight !px-0 !py-0 hover:bg-transparent min-h-[48px]" 
                />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
