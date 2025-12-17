import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // ตรวจสอบว่ามีอีเมลนี้ในระบบหรือยัง
    const existingUser = await db.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 400 });
    }

    // บันทึก user ใหม่ลงไฟล์ JSON
    const newUser = await db.user.create({
      data: {
        email,
        password,
        name,
        role: 'user' // กำหนด role เริ่มต้น
      }
    });

    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ', user: newUser });

  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 });
  }
}