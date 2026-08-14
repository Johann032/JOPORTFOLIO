"use client"

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"

type AudioContextType = {
  isSoundEnabled: boolean
  playStartup: () => void
  playServo: () => void
  playGreeting: () => void
}

const AudioContext = createContext<AudioContextType>({
  isSoundEnabled: false,
  playStartup: () => {},
  playServo: () => {},
  playGreeting: () => {}
})

export const useCh3rAudio = () => useContext(AudioContext)

export function Ch3rAudioProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const greetingAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Load preference from session storage
    const pref = sessionStorage.getItem("ch3r-sound")
    if (pref === "disabled") setIsSoundEnabled(false)
    
    // Initialize Audio
    greetingAudioRef.current = new Audio("/ch3r/audio/ch3r-greeting.mp3")
  }, [])

  const toggleSound = () => {
    const newState = !isSoundEnabled
    setIsSoundEnabled(newState)
    sessionStorage.setItem("ch3r-sound", newState ? "enabled" : "disabled")
  }

  const initWebAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {})
    }
  }

  const playStartup = useCallback(() => {
    if (!isSoundEnabled) return
    try {
      initWebAudio()
      const ctx = audioCtxRef.current!
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = "sine"
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
      
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch (e) {
      // Graceful fail
    }
  }, [isSoundEnabled])

  const playServo = useCallback(() => {
    if (!isSoundEnabled) return
    try {
      initWebAudio()
      const ctx = audioCtxRef.current!
      
      // White noise for tiny mechanical sound
      const bufferSize = ctx.sampleRate * 0.1 // 100ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      
      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.value = 4000
      
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      
      noise.start()
    } catch (e) {
      // Graceful fail
    }
  }, [isSoundEnabled])

  const playGreeting = useCallback(() => {
    if (!isSoundEnabled || !greetingAudioRef.current) return
    greetingAudioRef.current.volume = 0.4
    // Play with promise to handle autoplay block gracefully
    greetingAudioRef.current.play().catch(() => {
      // Autoplay blocked by browser. Fail silently as requested.
    })
  }, [isSoundEnabled])

  return (
    <AudioContext.Provider value={{ isSoundEnabled, playStartup, playServo, playGreeting }}>
      {children}
      <button 
        onClick={toggleSound}
        className="fixed bottom-6 right-6 z-[100] p-2.5 rounded-full bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 text-white/40 hover:text-white/90 hover:bg-[#111111] hover:border-white/20 transition-all duration-300"
        aria-label="Toggle AI Sound"
      >
        {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>
    </AudioContext.Provider>
  )
}
