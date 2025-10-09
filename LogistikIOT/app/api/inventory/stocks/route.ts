import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await db.item.findMany({ orderBy: { sku: 'asc' } })
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Failed to load inventory items', error)
    return NextResponse.json(
      { error: 'Unable to load inventory data. Please check your database connection.' },
      { status: 503 }
    )
  }
}
