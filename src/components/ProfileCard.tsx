// ProfileCard.tsx
'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProfileCard() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogin = () => {
    router.push("/pages/login") // พาไปหน้า login
  }

  return (
    <div>
      {session ? (
        <div>👋 ยินดีต้อนรับ, {session.user?.name}</div>
      ) : (
        <button onClick={handleLogin}>🔐 Login</button>
      )}
    </div>
  )
}
