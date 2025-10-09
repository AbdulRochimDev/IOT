import { PrismaClient } from '@prisma/client'
const g=globalThis as any; export const db=g.prisma||new PrismaClient({log:['warn','error']}); if(process.env.NODE_ENV!=='production') g.prisma=db;
