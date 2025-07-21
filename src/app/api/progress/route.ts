import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json()
  
  try {
    const newProgress = await prisma.progress.create({
      data: body
    })
    return NextResponse.json(newProgress);
  } catch (error) {
    console.error('Error creating progress:', error);
    return NextResponse.json({ message: 'Error creating progress' }, { status: 500 });
  }
}