import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { neonConfig } from "@neondatabase/serverless";
import { Pool } from "pg";
import ws from "ws";

// Configure WebSocket for Node.js runtime (required for Vercel serverless functions)
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if DATABASE_URL is a Neon database (contains neon.tech or uses pooled connection)
function isNeonDatabase(url: string): boolean {
  return url.includes("neon.tech") || url.includes("neon.") || url.includes("-pooler.");
}

// Lazy initialization function for Prisma client
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const dbUrl = process.env.DATABASE_URL;
    const logConfig = process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

    // Use PrismaNeon adapter for Neon databases, PrismaPg for local PostgreSQL
    if (isNeonDatabase(dbUrl)) {
      const adapter = new PrismaNeon({
        connectionString: dbUrl
      });

      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: logConfig as ("query" | "error" | "warn")[],
      });
    } else {
      // Use PrismaPg adapter for local PostgreSQL
      const pool = new Pool({ connectionString: dbUrl });
      const adapter = new PrismaPg(pool);

      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: logConfig as ("query" | "error" | "warn")[],
      });
    }
  }
  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();
export default prisma;
