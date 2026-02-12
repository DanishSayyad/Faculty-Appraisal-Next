import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`, {
      method: "GET",
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Health check API Error:", error)
    return NextResponse.json(
      { status: "error", message: "Failed to connect to backend" },
      { status: 500 }
    )
  }
}
