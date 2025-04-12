"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">เข้าสู่ระบบ</h1>
        <p className="mb-6 text-gray-300">เลือกวิธีเข้าสู่ระบบเพื่อเริ่มเรียน</p>

        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-md text-white font-semibold"
        >
          🔐 Login with Google
        </button>

        {/* สามารถเพิ่มปุ่มอื่นได้ในอนาคต */}
      </div>
    </div>
  );
}
