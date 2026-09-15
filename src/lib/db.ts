
// Purpose : Create one reusable prisma database client and prevent multiple database connnections during next.js development hot reloads
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
   prisma : PrismaClient;
} // global => unaffected by hot reloads in development because it is a global variable, so we can use it to store the PrismaClient instance

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
   globalForPrisma.prisma = prisma;
} // if we are in development mode, we want to store the PrismaClient instance in the global variable so that it can be reused across hot reloads

export default prisma;