"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SpeedHistoryProps {
  results: Array<{
    downloadSpeed: number
    uploadSpeed: number
    ping: number
    timestamp: string
  }>
}

export function SpeedHistory({ results }: SpeedHistoryProps) {
  const data = results.map((result) => ({
    timestamp: new Date(result.timestamp).toLocaleTimeString(),
    download: result.downloadSpeed,
    upload: result.uploadSpeed,
    ping: result.ping,
  }))

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Speed History</CardTitle>
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
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="download" stroke="var(--color-download)" strokeWidth={2} />
              <Line type="monotone" dataKey="upload" stroke="var(--color-upload)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

