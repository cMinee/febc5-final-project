import Link from "next/link"
import ProfileCard from "./ProfileCard"

export default function Layout({ children } : { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </nav>
            <ProfileCard />
        </div>
      </header>
      <main className="container mx-auto p-4 flex-1">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2023 Next.js Blog. All rights reserved.</p>
      </footer>
    </div>
  )
}