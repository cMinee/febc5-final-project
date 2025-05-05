import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  
  // ✅ ไม่ได้ login
  if (!token) {
    return NextResponse.redirect(new URL("/pages/login", req.url))
  }

  // ✅ เข้า admin route แต่ไม่ใช่ admin
  if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/pages/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"], // ✅ Protect /admin/*
}
