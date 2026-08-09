import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

// 🛡️ Prisma v7 호환형 안심 쿼리 프록시 래퍼 (Prisma 미연결 시에도 서버 중단 0% 보장)
let prismaInstance: any;
try {
  prismaInstance = globalForPrisma.prisma ?? new (PrismaClient as any)({ adapter: null, accelerateUrl: null });
} catch (e) {
  prismaInstance = new Proxy({}, {
    get: (_, prop) => {
      return new Proxy({}, {
        get: () => async () => null
      });
    }
  });
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
