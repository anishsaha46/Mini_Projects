import { PrismaClient } from "@prisma/client";

// create a singelton instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ??
new PrismaClient({
    log: ['query','error','warn'],
});

if(process.env.NODE_ENV !== 'production'){
    globalForPrisma.prisma = prisma;
}