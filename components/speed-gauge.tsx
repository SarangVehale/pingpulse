import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SpeedGaugeProps {
  icon: LucideIcon
  title: string
  value: number
  unit: string
  max: number
  color: "cyan" | "blue" | "green"
}

export function SpeedGauge({ icon: Icon, title, value, unit, max, color }: SpeedGaugeProps) {
  const percentage = (value / max) * 100
  const colorClass = {
    cyan: "from-cyan-500 to-cyan-700",
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
  }[color]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toFixed(2)} {unit}
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-secondary">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${colorClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

