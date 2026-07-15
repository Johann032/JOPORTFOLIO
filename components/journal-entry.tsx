"use client"

import { JournalEntry } from "@/lib/mdx"
import { CustomMDX } from "./mdx-remote"
import { useState } from "react"
import { ChevronDown, ChevronUp, Clock, CalendarDays } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative pl-8 pb-12 border-l border-[#2A2A2A] last:pb-0">
      {/* Timeline Node */}
      <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#030303]" />

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 text-xs font-mono text-[#A6A6A6]">
            <span className="flex items-center gap-1.5 bg-[#111111] px-2 py-1 rounded border border-[#2A2A2A]">
              <CalendarDays className="w-3.5 h-3.5" />
              {entry.formattedDate}
            </span>
            <span className="flex items-center gap-1.5 bg-[#111111] px-2 py-1 rounded border border-[#2A2A2A]">
              <Clock className="w-3.5 h-3.5" />
              {entry.readingTime}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">{entry.title}</h2>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-[#E5E5E5] hover:text-white transition-colors bg-[#111111] border border-[#2A2A2A] px-4 py-2 rounded-lg self-start whitespace-nowrap"
        >
          {isExpanded ? (
            <>Close Entry <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read Entry <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <div className="prose prose-invert max-w-none">
                <CustomMDX source={entry.content} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
