"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface SpeedDialProps {
  icon: LucideIcon
  title: string
  value: number
  unit: string
  color: string
}

export function SpeedDial({ icon: Icon, title, value, unit, color }: SpeedDialProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Array<{
      x: number
      y: number
      radius: number
      color: string
      speed: number
    }> = []

    const createParticles = () => {
      particles = []
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5})`,
          speed: Math.random() * 1,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.y -= particle.speed
        if (particle.y < 0) {
          particle.y = canvas.height
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    createParticles()
    animate()
  }, [])

  return (
    <Card className="relative overflow-hidden backdrop-blur-xl bg-white/10 border-white/20">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white/80">{title}</h3>
          <Icon className="h-5 w-5 text-white/60" />
        </div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl font-bold">
          <span className={`bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value.toFixed(2)}</span>
          <span className="text-lg ml-2 text-white/60">{unit}</span>
        </motion.div>
      </CardContent>
    </Card>
  )
}

