import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lessonId, completed } = body;
    
    const existing = await db.progress.findFirst({ 
      where: { userId, lessonId } 
    });
    
    if (existing) {
      await db.progress.update({ where: { id: existing.id }, data: { completed } });
    } else {
      await db.progress.create({ data: { userId, lessonId, completed } });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) return NextResponse.json([]);

  const progress = await db.progress.findMany({ where: { userId } });
  return NextResponse.json(progress);
}