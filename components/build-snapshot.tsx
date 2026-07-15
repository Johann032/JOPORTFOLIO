"use client"

import { JournalFrontmatter } from "@/lib/mdx"
import { Activity, Calendar, CheckCircle2, Clock, Cpu, GitCommit } from "lucide-react"

export function BuildSnapshot({ frontmatter }: { frontmatter: JournalFrontmatter }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-[#080808] border border-[#2A2A2A] rounded-xl mb-12 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wider text-[#A6A6A6] uppercase flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Date
        </span>
        <span className="text-sm text-white">{frontmatter.date}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wider text-[#A6A6A6] uppercase flex items-center gap-1.5">
          <GitCommit className="w-3.5 h-3.5" /> Version
        </span>
        <span className="text-sm font-mono text-[#E5E5E5]">{frontmatter.version || "v0.0.0"}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wider text-[#A6A6A6] uppercase flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Status
        </span>
        <span className="text-sm text-white flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          {frontmatter.status || "Active"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wider text-[#A6A6A6] uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> Progress
        </span>
        <div className="flex items-center gap-3 mt-1">
          <div className="h-1.5 flex-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${frontmatter.progress || 0}%` }}
            />
          </div>
          <span className="text-sm text-white font-mono">{frontmatter.progress || 0}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wider text-[#A6A6A6] uppercase flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Time Spent
        </span>
        <span className="text-sm text-white">{frontmatter.timeSpent || "N/A"}</span>
      </div>

      <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
        <span className="text-xs font-semibold tracking-wider text-[#A6A6A6] uppercase flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" /> Stack
        </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {frontmatter.tags?.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#1A1A1A] text-[#A6A6A6] rounded border border-[#2A2A2A]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
