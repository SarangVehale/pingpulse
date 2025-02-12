import { Card, CardContent } from "@/components/ui/card"
import { Activity, ArrowDown, ArrowUp } from "lucide-react"

interface SpeedDisplayProps {
  label: string
  value: number
  unit: string
  type: "download" | "upload" | "ping"
}

export function SpeedDisplay({ label, value, unit, type }: SpeedDisplayProps) {
  const icons = {
    download: ArrowDown,
    upload: ArrowUp,
    ping: Activity,
  }
  const Icon = icons[type]

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">{label}</span>
          <Icon className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="text-2xl font-semibold">
          {value.toFixed(1)}
          <span className="text-sm text-zinc-400 ml-1">{unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}

