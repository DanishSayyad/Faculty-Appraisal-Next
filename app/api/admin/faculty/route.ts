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

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/faculties`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Faculty API Error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty members" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/delete-user`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Delete Faculty API Error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete faculty member" },
      { status: 500 }
    )
  }
}
