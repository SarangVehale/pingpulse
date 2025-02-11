import SpeedTest from "@/components/speed-test"
import { Globe } from "@/components/globe"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-violet-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="text-center space-y-4 mb-12">
            <div className="relative">
              <h1 className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pb-2">
                PingPulse
              </h1>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            </div>
            <p className="text-lg text-indigo-200">Advanced Network Analytics & Speed Testing</p>
          </header>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="relative h-[600px]">
              <Globe />
            </div>
            <SpeedTest />
          </div>
        </div>
      </div>
    </main>
  )
}

