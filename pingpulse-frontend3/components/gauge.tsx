"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface GaugeProps {
  value: number
  maxValue: number
  label: string
  unit: string
  icon: LucideIcon
  color: string
}

export function Gauge({ value, maxValue, label, unit, icon: Icon, color }: GaugeProps) {
  const percentage = (value / maxValue) * 100
  const circumference = 2 * Math.PI * 38 // radius = 38
  const offset = circumference - (percentage / 100) * circumference

  return (
    <Card className="group relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 hover:bg-card/80 transition-colors duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-border"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="38"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`text-${color.split(" ")[1]}`} />
                <stop offset="100%" className={`text-${color.split(" ")[2]}`} />
              </linearGradient>
            </defs>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">
              {value.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

