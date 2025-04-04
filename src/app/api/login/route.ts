import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  (await cookies()).set("userId", userId, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return Response.json({ success: true, userId });
}