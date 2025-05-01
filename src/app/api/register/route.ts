import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "../../lib/prisma"

export async function POST(req: NextRequest) {
    console.log("🚀 REGISTER API START")
    try {
      const body = await req.json()
      const { email, password, name } = body
  
      if (!email || !password || !name) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
      }
  
      const exists = await prisma.user.findUnique({ where: { email } })
      if (exists) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 })
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
  
      // return NextResponse.json({ message: "Register Success", user: newUser })
      return NextResponse.json({
        message: "Register Success",
        user: JSON.parse(JSON.stringify(newUser)) // ✅ Fix จุดนี้!
      })
    } catch (err) {
      console.error("❌ REGISTER ERROR:", err)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}