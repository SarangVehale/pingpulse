"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"

interface ResultsChartProps {
  results: Array<{
    downloadSpeed: number
    uploadSpeed: number
    timestamp: string
  }>
}

export function ResultsChart({ results }: ResultsChartProps) {
  const data = results.map((result) => ({
    time: new Date(result.timestamp).toLocaleTimeString(),
    download: result.downloadSpeed,
    upload: result.uploadSpeed,
  }))

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Speed History</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" stroke="currentColor" fontSize={12} tickLine={false} opacity={0.5} />
              <YAxis
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                opacity={0.5}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Line type="monotone" dataKey="download" stroke="hsl(var(--blue-500))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="upload" stroke="hsl(var(--violet-500))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}

