import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      )
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Auth me API Error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to get user info" },
      { status: 500 }
    )
  }
}
