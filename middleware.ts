import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useIsMobile } from "./hooks/use-mobile";

const PUBLIC_PATHS = ["/"];
const ROLE_PATHS = {
  admin: ["/admin"],
  coordinator: ["/coordinator"],
  head: ["/head"],
  participant: ["/participant"],
};

function normalizeRole(role?: string): string | undefined {
  if (!role) return undefined;
  const r = role.toLowerCase();
  if (r.includes("coordinator")) return "coordinator";
  if (r.includes("head")) return "head";
  if (r.includes("admin")) return "admin";
  if (r.includes("participant")) return "participant";
  return r;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Skip static & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  // Public route access
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;
  let role = normalizeRole(req.cookies.get("role")?.value);

  if (!token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  try {
    const isValid = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
      {
        credentials: "include",
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );
    if (!isValid.ok) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    const data = await isValid.json();

    const res = NextResponse.next();

    res.cookies.set("access_token", data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    res.cookies.set("user", data.user, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
  } catch (error) {
    // Handle error
  }

  if (role) {
    for (const [r, paths] of Object.entries(ROLE_PATHS)) {
      if (paths.some((p) => pathname.startsWith(p)) && role !== r) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
