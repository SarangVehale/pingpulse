import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, MapPin, Network } from "lucide-react"

interface LocationInfoProps {
  ipInfo: {
    ip: string
    city: string
    region: string
    country: string
    org: string
  }
}

export function LocationInfo({ ipInfo }: LocationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">IP Address</p>
            <p className="text-sm text-muted-foreground">{ipInfo.ip}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">
              {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Network className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Service Provider</p>
            <p className="text-sm text-muted-foreground">{ipInfo.org}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

