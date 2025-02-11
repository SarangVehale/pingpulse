"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpeedDial } from "./speed-dial"
import { NetworkScore } from "./network-score"
import { TestHistory } from "./test-history"
import { ComparisonChart } from "./comparison-chart"
import { RealtimeMonitor } from "./realtime-monitor"
import { Activity, Download, Upload, Server } from "lucide-react"

interface SpeedTestResult {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter: number
  timestamp: string
  serverId: string
  serverLocation: string
  networkScore: number
  ipInfo: {
    ip: string
    city: string
    region: string
    country: string
    org: string
    loc: string
  }
}

export default function SpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"preparing" | "download" | "upload" | "analyzing" | null>(null)
  const [results, setResults] = useState<SpeedTestResult[]>([])
  const [latestResult, setLatestResult] = useState<SpeedTestResult | null>(null)

  const runSpeedTest = async () => {
    setIsRunning(true)
    setCurrentPhase("preparing")

    try {
      const response = await fetch("/api/speedtest", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Speed test failed")

      const result = await response.json()
      setLatestResult(result)
      setResults((prev) => [...prev, result])
    } catch (error) {
      console.error("Speed test error:", error)
    } finally {
      setIsRunning(false)
      setCurrentPhase(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden backdrop-blur-xl bg-white/10 border-white/20">
        <div className="p-6">
          <div className="space-y-6">
            {isRunning ? (
              <TestProgress phase={currentPhase} />
            ) : (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg h-16"
                onClick={runSpeedTest}
              >
                Start Speed Test
              </Button>
            )}

            {latestResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <SpeedDial
                  icon={Download}
                  title="Download"
                  value={latestResult.downloadSpeed}
                  unit="Mbps"
                  color="from-cyan-500 to-blue-500"
                />
                <SpeedDial
                  icon={Upload}
                  title="Upload"
                  value={latestResult.uploadSpeed}
                  unit="Mbps"
                  color="from-purple-500 to-pink-500"
                />
                <SpeedDial
                  icon={Activity}
                  title="Ping"
                  value={latestResult.ping}
                  unit="ms"
                  color="from-green-500 to-emerald-500"
                />
                <SpeedDial
                  icon={Server}
                  title="Jitter"
                  value={latestResult.jitter}
                  unit="ms"
                  color="from-amber-500 to-orange-500"
                />
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      {latestResult && (
        <div className="grid gap-6 md:grid-cols-2">
          <NetworkScore score={latestResult.networkScore} />
          <RealtimeMonitor result={latestResult} />
          <ComparisonChart result={latestResult} />
          <TestHistory results={results} />
        </div>
      )}
    </div>
  )
}

function TestProgress({ phase }: { phase: string | null }) {
  const phases = {
    preparing: "Preparing test environment...",
    download: "Testing download speed...",
    upload: "Testing upload speed...",
    analyzing: "Analyzing results...",
  }

  return (
    <div className="space-y-4">
      <div className="h-16 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"
        />
      </div>
      <p className="text-center text-lg text-indigo-200">
        {phase ? phases[phase as keyof typeof phases] : "Initializing..."}
      </p>
    </div>
  )
}

