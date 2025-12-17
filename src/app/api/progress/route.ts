import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId }
  });
  return NextResponse.json(lesson || {});
}