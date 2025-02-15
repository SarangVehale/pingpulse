"use client"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TraditionalSpeedometer } from "./traditional-speedometer"
import { ResultsChart } from "./results-chart"
import { NetworkInfo } from "./network-info"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

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
  const [currentTest, setCurrentTest] = useState<"download" | "upload" | null>(null)
  const [results, setResults] = useState<SpeedTestResult[]>([])
  const [latestResult, setLatestResult] = useState<SpeedTestResult | null>(null)

  const runSpeedTest = useCallback(async () => {
    if (isRunning) return

    try {
      setIsRunning(true)
      setCurrentTest("download")

      const response = await fetch("/api/speedtest")
      if (!response.ok) {
        throw new Error("Speed test failed. Please try again.")
      }

      const result = await response.json()
      setLatestResult(result)
      setResults((prev) => [...prev, result])
      toast.success("Speed test completed successfully")
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      toast.error(message)
    } finally {
      setIsRunning(false)
      setCurrentTest(null)
    }
  }, [isRunning])

  return (
    <div className="w-full space-y-8">
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="p-8">
          <div className="flex justify-center mb-12">
            <Button
              size="lg"
              variant="outline"
              className={`
                relative h-40 w-40 rounded-full border-4 transition-all duration-500 text-4xl font-bold
                ${isRunning ? "border-violet-500 shadow-lg shadow-violet-500/20" : "border-blue-500 shadow-lg shadow-blue-500/20"}
                hover:scale-105 hover:shadow-xl disabled:opacity-50
              `}
              onClick={runSpeedTest}
              disabled={isRunning}
            >
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10" />
              {isRunning ? (
                <div className="absolute inset-3 rounded-full border-t-4 border-violet-500 animate-spin" />
              ) : (
                "GO"
              )}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {latestResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-8 md:grid-cols-3"
              >
                <TraditionalSpeedometer
                  value={latestResult.downloadSpeed}
                  maxValue={200}
                  label="Download"
                  unit="Mbps"
                  color="blue-gradient"
                  isAnimating={isRunning && currentTest === "download"}
                />
                <TraditionalSpeedometer
                  value={latestResult.uploadSpeed}
                  maxValue={100}
                  label="Upload"
                  unit="Mbps"
                  color="purple-gradient"
                  isAnimating={isRunning && currentTest === "upload"}
                />
                <TraditionalSpeedometer
                  value={latestResult.ping}
                  maxValue={100}
                  label="Ping"
                  unit="ms"
                  color="green-gradient"
                  isAnimating={false}
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
            className="grid gap-8 md:grid-cols-2"
          >
            <NetworkInfo result={latestResult} />
            <ResultsChart results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

