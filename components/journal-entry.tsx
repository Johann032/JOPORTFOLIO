"use client"

import { JournalEntry } from "@/lib/mdx"
import { CustomMDX } from "./mdx-remote"
import { BuildSnapshot } from "./build-snapshot"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function JournalEntryCard({ entry, projectSlug }: { entry: JournalEntry; projectSlug: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative pl-8 pb-12 border-l border-[#2A2A2A] last:pb-0">
      {/* Timeline Node */}
      <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#030303]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div>
          <span className="text-sm font-mono text-[#A6A6A6]">{entry.frontmatter.date}</span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">{entry.frontmatter.title}</h2>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-[#E5E5E5] hover:text-white transition-colors bg-[#111111] border border-[#2A2A2A] px-4 py-2 rounded-lg self-start"
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
            <div className="pt-6">
              <BuildSnapshot frontmatter={entry.frontmatter} />
              
              <div className="prose prose-invert max-w-none">
                <CustomMDX source={entry.content} folder={entry.folder} projectSlug={projectSlug} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
