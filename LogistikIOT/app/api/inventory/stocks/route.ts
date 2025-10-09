import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
export async function GET(){const items=await db.item.findMany({orderBy:{sku:'asc'}}); return NextResponse.json({items})}
