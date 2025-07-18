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
    <div className="flex items-center justify-center min-h-screen bg-primary text-center">
      <div className="bg-tertiary rounded-xl px-10 py-20 border-fourth border-2 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md text-fourth text-xl">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="flex justify-center text-xl">
            Don’t you have an any account yet?&nbsp;
            <a
              className="underline font-bold mb-10"
              href="/pages/register"
            > Sing up
            </a>
          </p>
          <br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-primary"
          />
          <a className="flex justify-end text-fourth" href="#">Forgot password?</a>
          <br />
          <br />
          <button type="submit" className="w-full bg-secondary p-3 rounded-lg text-primary text-xl font-bold shadow-lg" disabled={isLoggedIn}>{isLoggedIn ? "Signing in..." : "Sign in"}</button>
        </form>
        {/* <br />
        <button onClick={() => router.push("/pages/register")} className="w-50 mx-auto justify-center bg-green-500 p-2 rounded">Register</button> */}
      </div>
    </div>
  )
}
