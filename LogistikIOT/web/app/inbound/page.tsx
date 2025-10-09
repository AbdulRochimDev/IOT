
'use client'
import { useState } from 'react'
export default function Inbound(){
  const [msg, setMsg] = useState('')
  async function receive(){
    setMsg('')
    const r = await fetch('/api/inbound/grn', { method:'POST' })
    const d = await r.json()
    setMsg(r.ok ? `GRN created: ${d.grnNumber}` : `Error: ${d.error}`)
  }
  return (<div className="space-y-3"><h2 className="text-xl">Inbound (PO → GRN → Putaway)</h2><button className="border px-3 py-2" onClick={receive}>Receive Seed PO</button>{msg && <div className="text-sm">{msg}</div>}</div>)
}
