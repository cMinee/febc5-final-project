// src/app/api/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("userId");
  return new Response("Logged out", { status: 200 });
}
