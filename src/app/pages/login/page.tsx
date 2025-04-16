"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    })

    if (res?.ok) {
      router.push("/") // กลับหน้าแรกเมื่อ login สำเร็จ
    } else {
      alert("เข้าสู่ระบบไม่สำเร็จ")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-20 text-white">
        <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />
        <button type="submit" className="w-full bg-blue-500 p-2 rounded">เข้าสู่ระบบ</button>

      </form>
      <br />
      <button onClick={() => router.push("/pages/register")} className="w-full bg-green-500 p-2 rounded">สมัครสมาชิก</button>
    </div>
  )
}
