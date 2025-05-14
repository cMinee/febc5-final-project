import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany(); 
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ message: 'Error fetching courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const body = await req.json()

  try {
    const newCourse = await prisma.course.create({
        data: body
    })
    return NextResponse.json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Error creating course' }, { status: 500 });
  }
}
