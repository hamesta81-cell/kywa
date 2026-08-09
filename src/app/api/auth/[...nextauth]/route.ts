import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import KakaoProvider from "next-auth/providers/kakao"
import { prisma } from "@/lib/prisma"

// 환경 변수 BOM 및 비-ASCII 오염 안전 소독
if (process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim().replace(/[^\x20-\x7E]/g, "");
  if (process.env.NODE_ENV === "production" && process.env.NEXTAUTH_URL.includes("localhost")) {
    delete process.env.NEXTAUTH_URL; // 🌟 프로덕션 환경에서 localhost URL 오염 제거 (NextAuth 동적 호스트 감지 활성화)
  }
}
if (process.env.KAKAO_CLIENT_ID) {
  process.env.KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID.trim()
    .replace(/^N\s*/i, "")
    .replace(/[^\x20-\x7E]/g, "");
}
if (process.env.KAKAO_CLIENT_SECRET) {
  process.env.KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET.trim()
    .replace(/^N\s*/i, "")
    .replace(/[^\x20-\x7E]/g, "");
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 실제 구현 시 비밀번호 해시(bcrypt) 검증 필요
        if (!credentials?.email) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (user) {
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }
        return null;
      }
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  }
})

export { handler as GET, handler as POST }
