import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

// GET /api/admin/courses/[courseId]/lessons/[lessonId]
export async function GET(req: Request, { params }: { params: { courseId: string, lessonId: string } }) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
  });
  return NextResponse.json(lesson);
}


export async function PATCH(req: NextRequest, { params }: { params: { lessonId: string } }) {
  const body = await req.json()
  const updated = await prisma.lesson.update({
    where: { id: params.lessonId },
    data: body
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { lessonId: string } }) {
  await prisma.lesson.delete({
    where: { id: params.lessonId }
  })
  return NextResponse.json({ ok: true })
}
