"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"

interface TraditionalSpeedometerProps {
  value: number
  maxValue: number
  label: string
  unit: string
  color: string
  isAnimating: boolean
}

export function TraditionalSpeedometer({
  value,
  maxValue,
  label,
  unit,
  color,
  isAnimating,
}: TraditionalSpeedometerProps) {
  const [displayValue, setDisplayValue] = useState(0)

  // Calculate rotation angle (-140 to 140 degrees for better visual)
  const anglePerUnit = 280 / maxValue
  const rotation = Math.min(value, maxValue) * anglePerUnit - 140

  // Generate tick marks and numbers
  const ticks = useMemo(() => {
    const count = 10
    const step = maxValue / count
    return Array.from({ length: count + 1 }).map((_, i) => ({
      value: i * step,
      angle: i * step * anglePerUnit - 140,
    }))
  }, [maxValue, anglePerUnit])

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setDisplayValue((prev) => {
          const next = prev + Math.random() * 10
          return next > value ? value : next
        })
      }, 50)

      return () => clearInterval(interval)
    } else {
      const duration = 1000
      const steps = 60
      const increment = (value - displayValue) / steps
      let currentStep = 0

      const interval = setInterval(() => {
        if (currentStep >= steps) {
          clearInterval(interval)
          setDisplayValue(value)
          return
        }

        setDisplayValue((prev) => prev + increment)
        currentStep++
      }, duration / steps)

      return () => clearInterval(interval)
    }
  }, [value, isAnimating, displayValue]) // Added displayValue to dependencies

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full drop-shadow-lg">
        {/* Background gradient */}
        <defs>
          <radialGradient id="dial-gradient">
            <stop offset="0%" stopColor="hsl(var(--card))" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Dial background */}
        <circle cx="100" cy="100" r="90" fill="url(#dial-gradient)" className="opacity-50" />

        {/* Tick marks and numbers */}
        {ticks.map(({ value: tickValue, angle }) => (
          <g key={tickValue} transform={`rotate(${angle} 100 100)`}>
            <line
              x1="100"
              y1="20"
              x2="100"
              y2="30"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/30"
            />
            <text
              x="100"
              y="45"
              textAnchor="middle"
              transform={`rotate(${-angle} 100 45)`}
              className="fill-muted-foreground text-xs"
            >
              {Math.round(tickValue)}
            </text>
          </g>
        ))}

        {/* Value arc */}
        <motion.path
          d={`M ${100 - Math.cos((140 * Math.PI) / 180) * 80},${100 - Math.sin((140 * Math.PI) / 180) * 80}
              A 80,80 0 0,1 ${100 + Math.cos((140 * Math.PI) / 180) * 80},${100 - Math.sin((140 * Math.PI) / 180) * 80}`}
          fill="none"
          stroke={`url(#${color})`}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / maxValue }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="drop-shadow-md"
        />

        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ rotate: -140 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          style={{ transformOrigin: "100px 100px" }}
          className="text-foreground"
        />

        {/* Center cap */}
        <circle cx="100" cy="100" r="8" className="fill-muted-foreground" />

        {/* Value display */}
        <text x="100" y="150" textAnchor="middle" className="fill-current text-3xl font-bold tracking-tight">
          {Math.round(displayValue)}
        </text>
        <text x="100" y="165" textAnchor="middle" className="fill-current text-xs font-medium">
          {unit}
        </text>

        {/* Label */}
        <text x="100" y="180" textAnchor="middle" className="fill-muted-foreground text-sm font-medium">
          {label}
        </text>

        {/* Gradients */}
        <defs>
          <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--blue-500))" />
            <stop offset="100%" stopColor="hsl(var(--cyan-500))" />
          </linearGradient>
          <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--violet-500))" />
            <stop offset="100%" stopColor="hsl(var(--purple-500))" />
          </linearGradient>
          <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--green-500))" />
            <stop offset="100%" stopColor="hsl(var(--emerald-500))" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

