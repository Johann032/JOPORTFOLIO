import { motion } from "framer-motion"

export function HeroMetadata() {
  const premiumEasing = [0.16, 1, 0.3, 1]

  const items = [
    {
      label: "> STATUS",
      value: "BUILDING",
      subValue: "ALWAYS LEARNING",
      valueColor: "text-emerald-500",
    },
    {
      label: "> FOCUS",
      value: "CYBERSECURITY",
      subValue: "CTF / SECURITY ENGINEERING",
      valueColor: "text-white",
    },
    {
      label: "> LOCATION",
      value: "KERALA, INDIA",
      valueColor: "text-white",
    },
  ]

  return (
    <div className="flex flex-row lg:flex-col flex-wrap gap-x-8 gap-y-4 lg:gap-10 text-[10px] sm:text-xs font-mono tracking-widest uppercase">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: premiumEasing }}
          className="flex flex-col gap-2"
        >
          <span className="text-muted-foreground/60">{item.label}</span>
          <span className={item.valueColor}>{item.value}</span>
          {item.subValue && (
            <span className="text-muted-foreground">{item.subValue}</span>
          )}
        </motion.div>
      ))}
    </div>
  )
}
