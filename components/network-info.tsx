"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, MapPin, Network } from "lucide-react"
import { motion } from "framer-motion"

interface NetworkInfoProps {
  result: {
    ipInfo: {
      ip: string
      city: string
      region: string
      country: string
      org: string
    }
  }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function NetworkInfo({ result }: NetworkInfoProps) {
  const { ipInfo } = result

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Network Information</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          <motion.div variants={item} className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background">
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">IP Address</p>
              <p className="text-sm font-medium">{ipInfo.ip}</p>
            </div>
          </motion.div>
          <motion.div variants={item} className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{`${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`}</p>
            </div>
          </motion.div>
          <motion.div variants={item} className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background">
              <Network className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ISP</p>
              <p className="text-sm font-medium">{ipInfo.org}</p>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

