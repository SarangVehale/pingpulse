"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Wifi, WifiOff } from "lucide-react"

interface RealtimeMonitorProps {
  result: {
    downloadSpeed: number
    uploadSpeed: number
    ping: number
    networkScore: number
  }
}

export function RealtimeMonitor({ result }: RealtimeMonitorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine)
    }

    const measureLatency = async () => {
      const start = performance.now()
      try {
        await fetch("/api/ping")
        const end = performance.now()
        setLatency(Math.round(end - start))
      } catch (error) {
        setLatency(null)
      }
    }

    window.addEventListener("online", checkConnection)
    window.addEventListener("offline", checkConnection)

    const interval = setInterval(measureLatency, 2000)

    return () => {
      window.removeEventListener("online", checkConnection)
      window.removeEventListener("offline", checkConnection)
      clearInterval(interval)
    }
  }, [])

  const getConnectionQuality = () => {
    if (!isOnline) return { label: "Offline", color: "text-red-400" }
    if (result.networkScore >= 90) return { label: "Excellent", color: "text-green-400" }
    if (result.networkScore >= 70) return { label: "Good", color: "text-blue-400" }
    if (result.networkScore >= 50) return { label: "Fair", color: "text-yellow-400" }
    return { label: "Poor", color: "text-red-400" }
  }

  const quality = getConnectionQuality()

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white/80">Real-time Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Status</span>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-green-400" />
                  <span className={quality.color}>{quality.label}</span>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-red-400" />
                  <span className="text-red-400">Offline</span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Current Latency</span>
              <span className="text-white">{latency !== null ? `${latency}ms` : "Measuring..."}</span>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((latency || 0) / 2, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-white/60">Download</div>
              <div className="text-lg font-semibold">{result.downloadSpeed.toFixed(2)} Mbps</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-white/60">Upload</div>
              <div className="text-lg font-semibold">{result.uploadSpeed.toFixed(2)} Mbps</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

