import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: { courseId: string } }) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId: params.courseId }
  })
  return NextResponse.json(lessons || [])
}

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  const body = await req.json()
  const newLesson = await prisma.lesson.create({
    data: {
      courseId: params.courseId,
      title: body.title,
      content: body.content,
      videoUrl: body && body.videoUrl ? body.videoUrl : "",
      courses: body.courses
    }
  })
  return NextResponse.json(newLesson)
}
