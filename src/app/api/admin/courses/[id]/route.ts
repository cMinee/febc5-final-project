import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const updated = await prisma.course.update({
      where: { id: params.id },
      data: body
    })
    return NextResponse.json(updated)
}
  
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await prisma.course.delete({
        where: { id: params.id }
    })
    return NextResponse.json({ ok: true })
}