import { PrismaClient } from "@/app/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// TypeScript mapping for Next.js hot-reloads
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// 1. Create a native PG database connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it with the official Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  // 3. Hand both properties to the constructor to make TypeScript happy!
  new PrismaClient({ adapter, log: ["query"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
