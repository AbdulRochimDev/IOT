
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function GET() {
  const data = await prisma.stock.findMany({ include: { warehouse: true, item: true } })
  return NextResponse.json({ data })
}
