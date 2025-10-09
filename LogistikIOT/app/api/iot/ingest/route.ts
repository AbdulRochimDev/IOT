import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
function verify(payload:any,sig:string,secret:string){const body=JSON.stringify(payload); const h=crypto.createHmac('sha256',secret).update(body).digest('base64'); return crypto.timingSafeEqual(Buffer.from(h),Buffer.from(sig))}
export async function POST(req:Request){const payload=await req.json().catch(()=>null); if(!payload) return new NextResponse('invalid json',{status:400}); const keyId=payload.keyId||'devkey'; const sig=payload.sig||''; const secret=process.env.AUTH_SECRET||'devsecret'; if(process.env.NODE_ENV==='production'){const ok=verify({ts:payload.ts,seq:payload.seq,type:payload.type,data:payload.data},sig,secret); if(!ok) return new NextResponse('bad signature',{status:401})} const ev=await db.event.create({data:{source:keyId,payload:JSON.stringify(payload)}}); return NextResponse.json({ok:true,id:ev.id})}
