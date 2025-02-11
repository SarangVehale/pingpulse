"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Download, Upload } from "lucide-react"
import { SpeedGauge } from "./speed-gauge"
import { SpeedHistory } from "./speed-history"
import { LocationInfo } from "./location-info"

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
  const [currentTest, setCurrentTest] = useState<"download" | "upload" | null>(null)
  const [results, setResults] = useState<SpeedTestResult[]>([])
  const [latestResult, setLatestResult] = useState<SpeedTestResult | null>(null)

  const runSpeedTest = async () => {
    setIsRunning(true)
    setProgress(0)
    setCurrentTest("download")

    // Simulate download test
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setCurrentTest("upload")
    setProgress(0)

    // Simulate upload test
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Simulate results
    const newResult: SpeedTestResult = {
      downloadSpeed: Math.random() * 100 + 50,
      uploadSpeed: Math.random() * 50 + 25,
      ping: Math.random() * 20 + 5,
      timestamp: new Date().toISOString(),
      ipInfo: {
        ip: "192.168.1.1",
        city: "New York",
        region: "NY",
        country: "USA",
        org: "Example ISP",
      },
    }

    setLatestResult(newResult)
    setResults((prev) => [...prev, newResult])
    setIsRunning(false)
    setCurrentTest(null)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Speed Test</CardTitle>
          <CardDescription>Test your internet connection speed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isRunning ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>{currentTest === "download" ? "Testing Download Speed..." : "Testing Upload Speed..."}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          ) : (
            <Button size="lg" className="w-full" onClick={runSpeedTest}>
              Start Speed Test
            </Button>
          )}

          {latestResult && (
            <div className="grid gap-4 md:grid-cols-3">
              <SpeedGauge
                icon={Download}
                title="Download"
                value={latestResult.downloadSpeed}
                unit="Mbps"
                max={200}
                color="cyan"
              />
              <SpeedGauge
                icon={Upload}
                title="Upload"
                value={latestResult.uploadSpeed}
                unit="Mbps"
                max={100}
                color="blue"
              />
              <SpeedGauge icon={Activity} title="Ping" value={latestResult.ping} unit="ms" max={100} color="green" />
            </div>
          )}
        </CardContent>
      </Card>

      {latestResult && (
        <>
          <LocationInfo ipInfo={latestResult.ipInfo} />
          <SpeedHistory results={results} />
        </>
      )}
    </div>
  )
}

