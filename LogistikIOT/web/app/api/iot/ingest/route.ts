
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: Request) {
  if (!prisma) return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 })
  const raw = await req.text()
  let body: any
  try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

  const key = await prisma.deviceKey.findUnique({ where: { keyId: body.keyId }, include: { device: true } })
  if (!key || !key.active) return NextResponse.json({ error: 'key_not_found' }, { status: 401 })

  const payloadForSig = JSON.stringify({ ts: body.ts, seq: body.seq, type: body.type, data: body.data })
  const expected = crypto.createHmac('sha256', key.secret).update(payloadForSig).digest('base64')
  if (expected !== body.sig) return NextResponse.json({ error: 'bad_sig' }, { status: 401 })

  if (Math.abs(Date.now() - body.ts) > 10 * 60 * 1000) return NextResponse.json({ error: 'stale' }, { status: 400 })

  try {
    const rec = await prisma.telemetry.create({
      data: { deviceId: key.deviceId, ts: new Date(body.ts), type: body.type, payload: body.data, seq: body.seq ?? null }
    })
    await prisma.device.update({ where: { id: key.deviceId }, data: { lastSeenAt: new Date() } })
    return NextResponse.json({ ok: true, id: rec.id })
  } catch (e: any) {
    if (String(e?.code) == 'P2002') return NextResponse.json({ ok: true, dedup: true })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
