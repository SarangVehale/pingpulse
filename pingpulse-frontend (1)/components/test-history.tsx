"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"

interface TestHistoryProps {
  results: Array<{
    downloadSpeed: number
    uploadSpeed: number
    ping: number
    timestamp: string
  }>
}

export function TestHistory({ results }: TestHistoryProps) {
  const data = results.map((result) => ({
    timestamp: format(new Date(result.timestamp), "HH:mm:ss"),
    download: result.downloadSpeed,
    upload: result.uploadSpeed,
    ping: result.ping,
  }))

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white/80">Test History</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            download: {
              label: "Download",
              color: "hsl(var(--chart-1))",
            },
            upload: {
              label: "Upload",
              color: "hsl(var(--chart-2))",
            },
            ping: {
              label: "Ping",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="timestamp" stroke="#ffffff40" fontSize={12} />
              <YAxis stroke="#ffffff40" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="download"
                stroke="var(--color-download)"
                strokeWidth={2}
                dot={{ fill: "var(--color-download)", strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="var(--color-upload)"
                strokeWidth={2}
                dot={{ fill: "var(--color-upload)", strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="ping"
                stroke="var(--color-ping)"
                strokeWidth={2}
                dot={{ fill: "var(--color-ping)", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

