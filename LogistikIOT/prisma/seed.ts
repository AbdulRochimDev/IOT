import { PrismaClient } from '@prisma/client'
const db=new PrismaClient(); async function main(){const items=[{sku:'BOX-001',name:'Box Standard',qty:100},{sku:'BOX-002',name:'Box Large',qty:50}]; for(const it of items){await db.item.upsert({where:{sku:it.sku},create:it,update:{}})} console.log('seed ok')} main().finally(()=>db.$disconnect())
