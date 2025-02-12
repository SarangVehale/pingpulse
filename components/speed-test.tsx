"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResultsChart } from "./results-chart"
import { NetworkInfo } from "./network-info"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Gauge } from "./gauge"
import { Activity, ArrowDown, ArrowUp } from "lucide-react"

interface SpeedTestResult {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  timestamp: string
  ipInfo: {
    ip: string
    city: string
    region: string
    country: string
    org: string
  }
}

export default function SpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<SpeedTestResult[]>([])
  const [latestResult, setLatestResult] = useState<SpeedTestResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runSpeedTest = async () => {
    setIsRunning(true)
    setError(null)
    setProgress(0)

    const simulateProgress = () => {
      setProgress((prev) => Math.min(prev + 1, 95))
    }

    const progressInterval = setInterval(simulateProgress, 150)

    try {
      const response = await fetch("/api/speedtest")
      if (!response.ok) {
        throw new Error("Speed test failed. Please try again.")
      }

      const result = await response.json()
      setProgress(100)
      setLatestResult(result)
      setResults((prev) => [...prev, result])
      toast.success("Speed test completed successfully")
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      toast.error(message)
    } finally {
      clearInterval(progressInterval)
      setTimeout(() => {
        setIsRunning(false)
        setProgress(0)
      }, 500)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="p-6">
          <div className="relative">
            {isRunning ? (
              <div className="space-y-4">
                <div className="h-12 relative rounded-lg border border-border/50 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                    Running Speed Test... {progress}%
                  </div>
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={runSpeedTest}
              >
                Start Speed Test
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {latestResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 grid gap-6 md:grid-cols-3"
              >
                <Gauge
                  value={latestResult.downloadSpeed}
                  maxValue={200}
                  label="Download"
                  unit="Mbps"
                  icon={ArrowDown}
                  color="from-blue-500 to-cyan-500"
                />
                <Gauge
                  value={latestResult.uploadSpeed}
                  maxValue={100}
                  label="Upload"
                  unit="Mbps"
                  icon={ArrowUp}
                  color="from-violet-500 to-purple-500"
                />
                <Gauge
                  value={latestResult.ping}
                  maxValue={100}
                  label="Ping"
                  unit="ms"
                  icon={Activity}
                  color="from-emerald-500 to-green-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <AnimatePresence>
        {latestResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <NetworkInfo result={latestResult} />
            <ResultsChart results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

