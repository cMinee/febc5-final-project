"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📨 Handle Submit เริ่มทำงาน")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    })

    if (res.ok) {
      alert("Register Success ✅")
      router.push("/pages/login")
    } else {
      alert("Register failed ❌")
      const errorData = await res.json()
      console.error("❌ REGISTER ERROR:", errorData)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-fourth text-center">
      <div className="bg-tertiary rounded-xl px-10 py-20 border-fourth border-2 w-full max-w-lg">
        <form onSubmit={handleRegister} className="space-y-4 max-w-md text-fourth text-xl">
          <h2 className="text-3xl font-bold">Welcome to...</h2>
          <br />
          <br />
          {/* name */}
          <input
            type="text"
            placeholder="Fullname"
            value={name}
            onChange={e => setName(e.target.value)}
            className="login-text login-container"
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-text login-container"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-text login-container"
            autoComplete="current-password"
          />
          <br />
          <br />
          <button type="submit" className="login-container login-text-btn">Register</button>
          <br /><br />
          <p className="flex justify-center">Already have an account?&nbsp;
            <a 
              className="underline font-bold"
              href="/pages/login"
            > Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
