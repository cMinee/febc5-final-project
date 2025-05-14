"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    })

    if (!res?.ok) {
      alert("Sign in failed ❌")
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role
      if (role === "admin") {
        console.log("🚀 ADMIN LOGIN SUCCESS")
        router.push("/pages/admin/courses")
      } else {
        console.log("🚀 USER LOGIN SUCCESS")
        router.push("/")
      }
    }
  }, [status, session, router])

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-20 text-white">
        <h2 className="text-2xl font-bold">Sign In</h2>
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
        <button type="submit" className="w-full bg-blue-500 p-2 rounded" disabled={isLoggedIn}>{isLoggedIn ? "Signing in..." : "Sign in"}</button>

      </form>
      <br />
      <button onClick={() => router.push("/pages/register")} className="w-50 mx-auto justify-center bg-green-500 p-2 rounded">Register</button>
    </div>
  )
}
