import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makeSafeProxy(): any {
  const handler: ProxyHandler<any> = {
    get(_, prop) {
      // if accessing nested model (e.g. prisma.product)
      return new Proxy(() => {}, {
        get(_, method) {
          const methodName = String(method);
          // common read operations
          if (/(findMany|findManyAsync|findManyRaw)/i.test(methodName) || /findMany/i.test(methodName)) {
            return async () => [];
          }
          if (/(findFirst|findUnique|findFirstOrThrow|findUniqueOrThrow)/i.test(methodName)) {
            return async () => null;
          }
          if (/count/i.test(methodName)) {
            return async () => 0;
          }
          // default fallback: return null-resolving fn
          return async () => null;
        },
        apply() {
          return Promise.resolve(null);
        },
      });
    },
  };

  return new Proxy({}, handler);
}

// If DATABASE_URL is not set, export a safe proxy that returns reasonable defaults
export const prisma: PrismaClient = (process.env.DATABASE_URL
  ? globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })
  : (makeSafeProxy() as unknown as PrismaClient));

if (process.env.DATABASE_URL && process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as PrismaClient;
