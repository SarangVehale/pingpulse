import SpeedTest from "@/components/speed-test"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            PingPulse
          </h1>
          <p className="text-gray-400">Internet Speed Test Tool</p>
        </header>
        <SpeedTest />
      </div>
    </main>
  )
}

