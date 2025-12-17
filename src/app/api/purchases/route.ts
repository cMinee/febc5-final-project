import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, amount, method, slipUrl } = body;

    if (!userId || !courseId || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if already purchased
    const existingPurchase = await db.purchase.findFirst({
        where: { userId, courseId }
    });

    if (existingPurchase) {
        return NextResponse.json({ message: "Course already purchased" }, { status: 200 });
    }

    const purchase = await db.purchase.create({
      data: {
        userId,
        courseId,
        amount,
        method,
        status: "completed", // Mocking success immediately
        purchasedAt: new Date().toISOString(),
        slipUrl: slipUrl || null,
      },
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        if (courseId) {
             const purchase = await db.purchase.findFirst({
                where: { userId, courseId }
            });
            return NextResponse.json(purchase || null);
        } else {
             const purchases = await db.purchase.findMany({
                where: { userId }
            });
            return NextResponse.json(purchases);
        }
    } catch (error) {
        console.error("Error fetching purchases:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
