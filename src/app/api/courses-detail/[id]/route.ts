// src/app/api/course-detail/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { courseDetails } from "@/app/lib/courses-detail"; // ปรับ path ตามจริง

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const courseId = Number(params.id);
  const course = courseDetails.find((c) => c.id === courseId);

  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}
