// src/app/api/progress/route.ts
import { NextRequest, NextResponse } from "next/server";

type ProgressPayload = {
  userId: number;
  courseId: number;
  subSectionId: number;
};

let progressStore: ProgressPayload[] = []; // memory storage for mock only

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as ProgressPayload;

    // basic validation
    if (!data.userId || !data.courseId || !data.subSectionId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // check for duplicates
    const exists = progressStore.find(
      (p) =>
        p.userId === data.userId &&
        p.courseId === data.courseId &&
        p.subSectionId === data.subSectionId
    );

    if (exists) {
      return NextResponse.json({ message: "Already completed" }, { status: 200 });
    }

    // add progress
    progressStore.push(data);

    return NextResponse.json({ success: true, progress: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request", details: error },
      { status: 500 }
    );
  }
}
