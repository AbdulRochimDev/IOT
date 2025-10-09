import { NextResponse } from 'next/server'
import { listInventory } from '@/lib/inventory'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const { items, error } = await listInventory()
  if (error) {
    return NextResponse.json({ items, error }, { status: 503 })
  }
  return NextResponse.json({ items })
}
