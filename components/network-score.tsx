"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NetworkScoreProps {
  score: number
}

export function NetworkScore({ score }: NetworkScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-blue-400"
    if (score >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 50) return "Fair"
    return "Poor"
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white/80">Network Quality Score</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-center">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle
                className="text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <motion.circle
                className={getScoreColor(score)}
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
                initial={{ strokeDasharray: "0 365" }}
                animate={{
                  strokeDasharray: `${(score / 100) * 365} 365`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-sm text-white/60">{getScoreLabel(score)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

