import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hashed } });
  return NextResponse.json({ success: true });
