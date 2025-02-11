import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = await fetch("http://localhost:8000/api/speedtest", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from Python backend")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to run speed test" }, { status: 500 })
  }
}

