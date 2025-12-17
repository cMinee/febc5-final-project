import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ค้นหา user จากไฟล์ JSON
    const user = await db.user.findFirst({
      where: { email, password }
    });

    if (!user) {
      return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    // ส่งข้อมูล user กลับไป (ตัด password ออกเพื่อความปลอดภัย)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ message: 'เข้าสู่ระบบสำเร็จ', user: userWithoutPassword });

  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 });
  }
}