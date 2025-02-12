import SpeedTest from "@/components/speed-test"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 transition-colors duration-300">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        <header className="text-center space-y-4">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-400 dark:to-violet-400 pb-2">
              PingPulse
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-400 dark:to-violet-400 transform origin-left" />
          </div>
          <p className="text-muted-foreground">Advanced Network Analytics & Speed Testing</p>
        </header>
        <SpeedTest />
      </div>
    </main>
  )
}

