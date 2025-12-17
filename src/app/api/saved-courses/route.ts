import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src/app/db.json");

function readDB() {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
}

function writeDB(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// GET - รายการคอร์สที่ save ไว้ของ user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = readDB();
    const userSavedCourses = db.savedCourses.filter((sc: any) => sc.userId === userId);
    
    // ดึงข้อมูลคอร์สทั้งหมดที่ user save ไว้
    const savedCourseIds = userSavedCourses.map((sc: any) => sc.courseId);
    const courses = db.courses.filter((c: any) => savedCourseIds.includes(c.id));

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching saved courses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Save course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId are required" },
        { status: 400 }
      );
    }

    const db = readDB();

    // ตรวจสอบว่า save ไว้แล้วหรือยัง
    const exists = db.savedCourses.some(
      (sc: any) => sc.userId === userId && sc.courseId === courseId
    );

    if (exists) {
      return NextResponse.json(
        { message: "Course already saved" },
        { status: 200 }
      );
    }

    // เพิ่ม saved course
    db.savedCourses.push({
      id: Date.now().toString(),
      userId,
      courseId,
      savedAt: new Date().toISOString(),
    });

    writeDB(db);

    return NextResponse.json(
      { message: "Course saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving course:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Unsave course
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId are required" },
        { status: 400 }
      );
    }

    const db = readDB();

    // ลบ saved course
    db.savedCourses = db.savedCourses.filter(
      (sc: any) => !(sc.userId === userId && sc.courseId === courseId)
    );

    writeDB(db);

    return NextResponse.json(
      { message: "Course unsaved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsaving course:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
