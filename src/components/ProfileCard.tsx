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
          <span className="hidden lg:block text-fourth text-xl">{session.user && session.user.name}</span>
          <button
            className="md:text-xl bg-secondary border-black border text-primary px-3 py-1 rounded-md hover:text-xl hover:bg-primary hover:text-black hover:border-secondary hover:border-2"
            onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button
          className="md:text-xl bg-secondary border-black border text-primary px-3 py-1 rounded-md hover:text-xl hover:bg-primary hover:text-black hover:border-secondary hover:border-2"
          onClick={handleLogin}>
            Login
        </button>
      )}
    </div>
  )
}
