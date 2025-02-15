import SpeedTest from "@/components/speed-test"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="relative mx-auto max-w-5xl p-4 md:p-8 min-h-screen flex flex-col">
        <header className="py-8 md:py-12 text-center relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-500/10 via-violet-500/10 to-transparent blur-3xl" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              PingPulse
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground">Professional Network Speed Testing & Analytics</p>
        </header>
        <div className="flex-1 flex items-center justify-center -mt-8">
          <SpeedTest />
        </div>
      </div>
    </main>
  )
}

