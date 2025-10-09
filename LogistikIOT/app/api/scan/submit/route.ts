import { NextResponse } from 'next/server'
import { applyMovement } from '@/lib/stock'
export async function POST(req:Request){const {code,mode='inbound',warehouseCode='WH-A',qty=1}=await req.json(); if(!code) return new NextResponse('code required',{status:400}); if(!['inbound','outbound','count'].includes(mode)) return new NextResponse('invalid mode',{status:400}); const item=await applyMovement(String(code),Number(qty),mode as any); return NextResponse.json({ok:true,warehouseCode,mode,item})}
