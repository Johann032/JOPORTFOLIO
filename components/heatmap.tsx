"use client"

import { parseISO, format, differenceInDays } from "date-fns"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function Heatmap({ dates }: { dates: string[] }) {
  // Generate last 365 days
  const today = new Date()
  const days = Array.from({ length: 365 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (364 - i))
    return format(d, "yyyy-MM-dd")
  })

  // Group into weeks for a grid layout (columns of 7)
  const weeks = []
  let currentWeek = []
  
  for (let i = 0; i < days.length; i++) {
    currentWeek.push(days[i])
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  const dateSet = new Set(dates)

  return (
    <div className="p-6 bg-[#080808] border border-[#2A2A2A] rounded-xl overflow-x-auto scrollbar-hide">
      <div className="flex flex-col gap-2 min-w-max">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white tracking-tight">Engineering Activity</h3>
          <span className="text-xs text-[#A6A6A6]">{dates.length} Contributions in the last year</span>
        </div>
        
        <div className="flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day) => {
                const isActive = dateSet.has(day)
                return (
                  <HoverCard key={day} openDelay={0} closeDelay={0}>
                    <HoverCardTrigger asChild>
                      <div 
                        className={`w-3 h-3 rounded-[2px] transition-colors duration-200 ${
                          isActive 
                            ? "bg-white hover:bg-[#E5E5E5] shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
                            : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                        }`}
                      />
                    </HoverCardTrigger>
                    {isActive && (
                      <HoverCardContent 
                        side="top" 
                        className="w-auto p-2 bg-[#111111] border-[#2A2A2A] text-xs text-white z-50"
                      >
                        Journal Entry on {format(parseISO(day), "MMM d, yyyy")}
                      </HoverCardContent>
                    )}
                  </HoverCard>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
