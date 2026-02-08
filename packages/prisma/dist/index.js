"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = exports.prisma = void 0;
// Import PrismaClient from generated location
// Using require to ensure correct path resolution in compiled output
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prismaModule = require('../src/generated/index.js');
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new prismaModule.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
// Export PrismaClient
exports.PrismaClient = prismaModule.PrismaClient;
//# sourceMappingURL=index.js.map