import { NextResponse } from 'next/server'
import { applyMovement } from '@/lib/stock'
export async function GET(){return NextResponse.json({ok:true,note:'demo only'})}
export async function POST(req:Request){const {sku,qty}=await req.json(); if(!sku||!qty) return new NextResponse('sku/qty required',{status:400}); const item=await applyMovement(String(sku),Number(qty),'outbound'); return NextResponse.json({ok:true,item})}
