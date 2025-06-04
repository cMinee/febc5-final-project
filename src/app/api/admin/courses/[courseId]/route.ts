import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    const body = await req.json()
    try {
        const updated = await prisma.course.update({
            where: { id: params.courseId },
            data: body
        })
        return NextResponse.json(updated)
    } catch (err) {
        console.error("❌ UPDATE ERROR:", err)
        return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    await prisma.course.delete({
      where: { id: params.courseId }
    })

    return NextResponse.json({ message: "Course deleted" }) // ✅ object เท่านั้น
  } catch (err) {
    console.error("❌ DELETE ERROR:", err)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}