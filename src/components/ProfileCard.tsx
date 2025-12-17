// ProfileCard.tsx
'use client'

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfileCard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  // ป้องกัน hydration error
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogin = () => {
    router.push("/pages/login")
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/pages/login" })
  }

  // แสดง skeleton/placeholder ก่อน mount
  if (!isMounted) {
    return (
      <div className="w-20 h-10 bg-secondary-200 animate-pulse rounded-lg"></div>
    )
  }

  return (
    <div>
      {session ? (
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-secondary-900 font-medium">
            {session.user && session.user.name}
          </span>
          <button
            className="px-4 py-2 bg-gradient-to-r from-secondary-700 to-secondary-800 text-white font-medium rounded-lg 
                       hover:from-secondary-800 hover:to-secondary-900 
                       transition-all duration-200 shadow-soft hover:shadow-soft-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg 
                     hover:from-primary-600 hover:to-primary-700 
                     transition-all duration-200 shadow-soft hover:shadow-soft-lg"
          onClick={handleLogin}
        >
          Login
        </button>
      )}
    </div>
  )
}
