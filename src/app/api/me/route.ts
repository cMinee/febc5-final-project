// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "mysecret"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string }

    return NextResponse.json({
      userId: decoded.userId,
      name: "Mock User", // หรือดึงจาก database ก็ได้
    })
  } catch (err) {
    console.error("❌ JWT Verify Error:", err)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
