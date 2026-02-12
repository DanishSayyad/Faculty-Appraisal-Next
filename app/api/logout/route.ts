import { NextResponse } from "next/server";



export async function POST(req: Request) {

    const token = req.headers.get("authorization")?.split(" ")[1] || null;
    if(!token){
        return NextResponse.json({ ok: false, message: "No token provided" }, { status: 400 });
    }
        const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {

            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
        });

    const data=await res.json();
    if(!res.ok){
        return NextResponse.json({ ok: false, message: data.message || "Logout failed" }, { status: res.status });
    }

    const COOKIES_TO_CLEAR = data.cookies || ["access_token", "refresh_token", "user", "role"];

    const response = NextResponse.json({ ok: true, message: "Logged out" });
    
    for (const cookie of COOKIES_TO_CLEAR) {
        response.headers.append(
            "Set-Cookie",
            `${cookie}=; path=/; max-age=0; SameSite=Lax`
        );
    }
    return response;
}