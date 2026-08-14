"use client"

import { motion, useAnimation, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Sparkles } from "lucide-react"

export function AiCompanion() {
  const [hasEntered, setHasEntered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const controls = useAnimation()
  
  // Permanent cute cyber smile (perfected proportions)
  const smilePath = "M 4 4 Q 10 9 16 4"

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      mouseX.set(x)
      mouseY.set(y)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const springConfig = { damping: 20, stiffness: 250 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  const eyeTrackX = useTransform(smoothMouseX, [-1, 1], [-5, 5])
  const eyeTrackY = useTransform(smoothMouseY, [-1, 1], [-3, 3])

  // Entrance Sequence
  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        y: 0,
        opacity: 1,
        rotate: [0, -15, 15, -5, 0],
        transition: { 
          default: { type: "spring", damping: 14, stiffness: 80, delay: 0.3 },
          rotate: { type: "tween", duration: 1.5, ease: "easeInOut", delay: 0.3 }
        }
      })
      setHasEntered(true)
    }
    sequence()
  }, [controls])

  // Random Blinking
  useEffect(() => {
    if (!hasEntered) return
    const blinkLoop = () => {
      const nextBlink = Math.random() * 2500 + 1000
      setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 100)
        blinkLoop()
      }, nextBlink)
    }
    blinkLoop()
  }, [hasEntered])

  const handleCompanionClick = () => {
    setIsModalOpen(true)
  }

  const cyberCyan = "#00FFCC"
  const glitchRed = "#FF003C"

  return (
    <>
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 lg:top-12 lg:right-12 z-50">
        <motion.div
          initial={{ y: -150, opacity: 0 }}
          animate={controls}
          className="relative w-[48px] h-[64px] md:w-[52px] md:h-[68px] cursor-pointer group perspective-[1200px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCompanionClick}
        >
          {/* Holographic Cyber HUD Rings */}
          <AnimatePresence>
            {hasEntered && (
              <>
                <motion.div 
                  animate={{ opacity: isHovered ? 0.8 : 0.3, scale: 1, rotateX: 65, rotateZ: 360 }}
                  transition={{ rotateZ: { duration: 8, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] border-[1.5px] border-[#00FFCC] rounded-full border-dashed pointer-events-none"
                  style={{ transformStyle: "preserve-3d" }}
                />
              </>
            )}
          </AnimatePresence>

          {/* GLITCHY BODY WRAPPER */}
          <motion.div 
            className="w-full h-full relative z-10"
            // The glitch effect applies random sharp skews and translates periodically
            animate={
              isHovered ? { scale: 1.1, rotateX: 15, rotateY: -20, y: -5 } :
              hasEntered ? { 
                y: [-5, 5, -5, -5, -4, -6, -5, -5, 5, -5], 
                rotateZ: [-2, 2, -2, -2, 5, -5, -2, -2, 2, -2],
                skewX: [0, 0, 0, 0, 15, -15, 0, 0, 0, 0],
                x: [0, 0, 0, 0, 4, -4, 0, 0, 0, 0]
              } : { y: 0, rotateZ: 0 }
            }
            transition={
              isHovered ? { type: "spring", stiffness: 400, damping: 20 } : 
              { 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.4, 0.45, 0.46, 0.47, 0.48, 0.49, 0.5, 0.9, 1] // Sharp sudden glitch in the middle
              }
            }
          >
            {/* Cyber Thruster */}
            <motion.div 
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full blur-[6px] mix-blend-screen"
              animate={
                isHovered ? { opacity: 1, scale: 1.5, backgroundColor: cyberCyan } :
                hasEntered ? { opacity: [0.5, 0.9, 0.5], scale: [0.8, 1.2, 0.8], backgroundColor: cyberCyan } : 
                { opacity: 0, backgroundColor: cyberCyan }
              }
              transition={isHovered ? { duration: 0.2 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main Cyber Shell (Fragmented/Edgy Design) */}
            <div className="absolute inset-0 bg-[#0A0A0E] rounded-xl shadow-[inset_0_0_20px_rgba(0,255,204,0.1),0_8px_16px_rgba(0,0,0,0.6)] border border-[#00FFCC]/30 overflow-hidden backdrop-blur-xl">
              
              {/* Glitch Overlay (Flashes red/cyan occasionally) */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-[#FF003C]/20 to-transparent mix-blend-overlay"
                animate={hasEntered ? { opacity: [0, 0, 0.8, 0, 0] } : { opacity: 0 }}
                transition={{ duration: 6, repeat: Infinity, times: [0, 0.46, 0.47, 0.48, 1] }}
              />

              {/* Diagonal cyber cuts */}
              <div className="absolute top-[10%] -left-[10%] w-[120%] h-[1px] bg-[#00FFCC]/20 rotate-12" />
              <div className="absolute bottom-[20%] -left-[10%] w-[120%] h-[1px] bg-[#FF003C]/20 -rotate-12" />
              
              {/* PERFECTED FACE: Sharp, embedded CRT monitor look */}
              <div className="absolute top-[25%] left-[10%] w-[80%] h-[45%] bg-[#030303] rounded-md shadow-[inset_0_0_10px_rgba(0,0,0,1)] border-t border-b border-[#00FFCC]/20 overflow-hidden flex items-center justify-center">
                
                {/* CRT Scanline Background */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "linear-gradient(transparent 50%, rgba(0, 255, 204, 0.1) 50%)", backgroundSize: "100% 4px" }} />

                {/* Eyes & Expressions Container */}
                <motion.div 
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5"
                  style={{ 
                    x: hasEntered && !isHovered ? eyeTrackX : 0, 
                    y: hasEntered && !isHovered ? eyeTrackY : 0 
                  }}
                  animate={hasEntered ? {
                    // Chromatic aberration glitch on the face
                    filter: [
                      "drop-shadow(0 0 0 transparent)", 
                      "drop-shadow(0 0 0 transparent)", 
                      "drop-shadow(3px 0 0 #FF003C) drop-shadow(-3px 0 0 #00FFCC)", 
                      "drop-shadow(0 0 0 transparent)", 
                      "drop-shadow(0 0 0 transparent)"
                    ]
                  } : {}}
                  transition={{ duration: 6, repeat: Infinity, times: [0, 0.46, 0.47, 0.48, 1] }}
                >
                  <motion.div
                    className="flex flex-col items-center justify-center gap-1 w-full h-full"
                    animate={
                      isBlinking ? { scaleY: 0.05 } : 
                      isHovered ? { scaleY: 1.2, x: -2, y: -2 } : 
                      { scaleY: 1, x: 0, y: 0 }
                    }
                    transition={{ duration: isBlinking ? 0.08 : 0.3 }}
                  >
                    {/* Sharper, perfect cyber eyes (glowing slits with cores) */}
                    <div className="flex gap-2">
                      <motion.div 
                        className="relative w-[12px] h-[6px] md:w-[14px] md:h-[8px] bg-[#00FFCC]/20 rounded-sm flex items-center justify-center overflow-hidden border border-[#00FFCC]/50"
                        animate={{ 
                          boxShadow: `0 0 8px ${isHovered ? glitchRed : cyberCyan}`
                        }}
                      >
                        <motion.div 
                          className="w-[4px] h-[4px] bg-[#00FFCC] rounded-full shadow-[0_0_6px_#00FFCC]"
                          animate={{ backgroundColor: isHovered ? glitchRed : cyberCyan, x: hasEntered && !isHovered ? eyeTrackX : 0 }}
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="relative w-[12px] h-[6px] md:w-[14px] md:h-[8px] bg-[#00FFCC]/20 rounded-sm flex items-center justify-center overflow-hidden border border-[#00FFCC]/50"
                        animate={{ 
                          boxShadow: `0 0 8px ${isHovered ? glitchRed : cyberCyan}`
                        }}
                      >
                        <motion.div 
                          className="w-[4px] h-[4px] bg-[#00FFCC] rounded-full shadow-[0_0_6px_#00FFCC]"
                          animate={{ backgroundColor: isHovered ? glitchRed : cyberCyan, x: hasEntered && !isHovered ? eyeTrackX : 0 }}
                        />
                      </motion.div>
                    </div>

                    {/* Permanent Cute Smile - perfectly proportioned */}
                    <div className="w-[14px] h-[6px]">
                      <svg viewBox="0 0 20 12" className="w-full h-full overflow-visible">
                        <motion.path 
                          d={smilePath}
                          animate={{ 
                            stroke: isHovered ? glitchRed : cyberCyan,
                            filter: `drop-shadow(0 0 4px ${isHovered ? glitchRed : cyberCyan})`
                          }}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
            
            {/* Cyber Brackets [  ] */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#00FFCC]/80 tracking-widest opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
              [
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#00FFCC]/80 tracking-widest opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
              ]
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Simple Clean Shortcuts Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xs bg-black/50 border border-[#00FFCC]/20 rounded-3xl p-6 shadow-2xl overflow-hidden backdrop-blur-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-[#00FFCC] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center mb-6 mt-2">
                <div className="w-14 h-14 bg-[#00FFCC]/5 border border-[#00FFCC]/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,255,204,0.15)]">
                   <Sparkles className="text-[#00FFCC]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">KUTTAN</h3>
                <p className="text-xs text-[#00FFCC]/50 uppercase tracking-widest mt-1">Shortcuts</p>
              </div>
              
              <div className="space-y-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-center items-center text-white/90 hover:bg-[#00FFCC]/10 hover:text-[#00FFCC] hover:border-[#00FFCC]/30 cursor-pointer transition-all duration-300" onClick={() => setIsModalOpen(false)}>
                  <span className="font-medium text-sm">Explore Projects</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-center items-center text-white/90 hover:bg-[#00FFCC]/10 hover:text-[#00FFCC] hover:border-[#00FFCC]/30 cursor-pointer transition-all duration-300" onClick={() => setIsModalOpen(false)}>
                  <span className="font-medium text-sm">View Resume</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-center items-center text-white/90 hover:bg-[#00FFCC]/10 hover:text-[#00FFCC] hover:border-[#00FFCC]/30 cursor-pointer transition-all duration-300" onClick={() => setIsModalOpen(false)}>
                  <span className="font-medium text-sm">Contact Me</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
