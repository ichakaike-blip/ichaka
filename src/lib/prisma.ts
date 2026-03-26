import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (process.env.VERCEL && process.env.DATABASE_URL?.startsWith("file:")) {
	console.warn("SQLite file database is not recommended on serverless deployments. Use a hosted database in production.");
}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
