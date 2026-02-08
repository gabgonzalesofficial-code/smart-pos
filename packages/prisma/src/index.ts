// Import PrismaClient from generated location
// Using require to ensure correct path resolution in compiled output
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prismaModule = require('../src/generated/index.js');

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof prismaModule.PrismaClient> | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new prismaModule.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export PrismaClient
export const PrismaClient = prismaModule.PrismaClient;

// Type exports
export type { Prisma } from './generated/index';
