import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "../../lib/prisma"

export async function POST(req: NextRequest) {
    console.log("🚀 REGISTER API START")
    try {
      const body = await req.json()
      const { email, password, name } = body
  
      if (!email || !password || !name) {
        return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 })
      }
  
      const exists = await prisma.user.findUnique({ where: { email } })
      if (exists) {
        return NextResponse.json({ error: "ผู้ใช้นี้มีอยู่แล้ว" }, { status: 409 })
      }
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      })
  
      console.log("✅ new user created:")

      if (!newUser || typeof newUser !== "object") {
        console.error("❌ newUser is not a valid object:", newUser)
      }
  
      return NextResponse.json({ message: "ลงทะเบียนสำเร็จ", user: newUser })
    } catch (err) {
      console.error("❌ REGISTER ERROR:", err)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}