"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📨 Handle Submit เริ่มทำงาน")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    })

    if (res.ok) {
      alert("สมัครสมาชิกสำเร็จ ✅")
      router.push("/pages/login")
    } else {
      alert("เกิดข้อผิดพลาดในการสมัคร ❌")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-20 text-white">
      <h2 className="text-2xl font-bold">สมัครสมาชิก</h2>
      {/* name */}
      <input
        type="text"
        placeholder="Fullname"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 rounded bg-gray-800"
      />
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
      <button type="submit" className="w-full bg-green-500 p-2 rounded">Register</button>
    </form>
  )
}
