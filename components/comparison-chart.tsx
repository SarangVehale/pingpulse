"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ComparisonChartProps {
  result: {
    downloadSpeed: number
    uploadSpeed: number
  }
}

export function ComparisonChart({ result }: ComparisonChartProps) {
  // Average speeds from various sources (example data)
  const data = [
    {
      name: "Your Speed",
      download: result.downloadSpeed,
      upload: result.uploadSpeed,
    },
    {
      name: "Country Avg",
      download: 100,
      upload: 50,
    },
    {
      name: "Global Avg",
      download: 80,
      upload: 40,
    },
  ]

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white/80">Speed Comparison</CardTitle>
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
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="download" fill="var(--color-download)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="upload" fill="var(--color-upload)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

