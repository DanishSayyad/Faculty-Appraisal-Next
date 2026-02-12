import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    

    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await res.json();

    const setCookieHeader = res.headers.get("set-cookie");
    const response = NextResponse.json(data, { status: res.status });

    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=[^;]+?=)/g);
      for (const cookie of cookies) {
          response.headers.append("Set-Cookie", cookie);
      }
    }

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
