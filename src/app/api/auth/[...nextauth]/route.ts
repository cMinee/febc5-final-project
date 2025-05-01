import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
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

        // ✅ หา user จาก Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.error("❌ No user found with email:", credentials.email);
          return null;
        }

        // ✅ เปรียบเทียบ password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          console.error("❌ Invalid password for user:", credentials.email);
          return null;
        }

        // ✅ Return เฉพาะข้อมูลที่จำเป็น
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",  // ใช้ JWT แทน session ธรรมดา
  },
  secret: process.env.NEXTAUTH_SECRET, // ต้องมีใน .env
});

export { handler as GET, handler as POST };
