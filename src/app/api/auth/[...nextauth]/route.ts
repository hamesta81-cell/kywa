import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import KakaoProvider from "next-auth/providers/kakao"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// 환경 변수 BOM 및 비-ASCII 오염 안전 소독
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

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "kywa_safety_secret_key_2026",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
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
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  }
};

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: any) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host && !host.includes("localhost")) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  } else if (process.env.RENDER_EXTERNAL_URL) {
    process.env.NEXTAUTH_URL = process.env.RENDER_EXTERNAL_URL;
  }
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host && !host.includes("localhost")) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  } else if (process.env.RENDER_EXTERNAL_URL) {
    process.env.NEXTAUTH_URL = process.env.RENDER_EXTERNAL_URL;
  }
  return handler(req, ctx);
}
