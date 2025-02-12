import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://localhost:8000/api/speedtest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Speed test error:", error)
    return NextResponse.json({ error: "Failed to run speed test. Please try again." }, { status: 500 })
  }
}

