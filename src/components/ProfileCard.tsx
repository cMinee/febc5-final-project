// ProfileCard.tsx
'use client'

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProfileCard() {
  const { data: session } = useSession()
  // console.log("🧠 Session:", session)
  const router = useRouter()

  const handleLogin = () => {
    router.push("/pages/login") // go to login
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/pages/login" }) // redirect to home page after logout
  }

  return (
    <div>
      {session ? (
        <div className="flex items-center space-x-2">
          <span className="text-white">{session.user && session.user.name}</span>
          <button
            className="bg-secondary border-black border-2 text-white px-3 py-1 rounded-md"
            onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>🔐 Login</button>
      )}
    </div>
  )
}
