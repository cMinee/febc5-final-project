import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from "fs";
import path from "path";

// อ่าน users จาก db.json
function getUsers() {
  const filePath = path.join(process.cwd(), "src/app/db.json");
  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);
  return data.users || [];
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🚀 AUTHORIZATION START", credentials);
        
        // ✅ ตรวจสอบว่า credentials มีจริง
        if (!credentials?.email || !credentials?.password) {
          console.error("❌ Missing credentials");
          return null;
        }

        // ✅ หา user จาก db.json
        const users = getUsers();
        const user = users.find((u: any) => u.email === credentials.email);

        if (!user) {
          console.error("❌ No user found with email:", credentials.email);
          return null;
        }

        // ✅ เปรียบเทียบ password (plain text)
        if (user.password !== credentials.password) {
          console.error("❌ Invalid password for user:", credentials.email);
          return null;
        }

        console.log("✅ Login successful for:", user.email);

        // ✅ Return เฉพาะข้อมูลที่จำเป็น
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",  // ใช้ JWT แทน session ธรรมดา
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role // 👈 เพิ่ม role ลงใน token
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role // 👈 ให้ฝั่ง frontend ใช้ role ได้
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/pages/login',  // redirect ไปหน้า login ของเรา
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here", // fallback ถ้าไม่มี env
});

export { handler as GET, handler as POST };
