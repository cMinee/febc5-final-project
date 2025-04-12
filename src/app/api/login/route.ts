// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // You can log/save or mock auth here
  console.log("✅ Logged in:", userId);

  return NextResponse.json({ success: true, userId });
}
