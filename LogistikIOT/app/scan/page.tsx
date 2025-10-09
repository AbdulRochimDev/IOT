'use client'
import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function ScanPage() {
  const [code, setCode] = useState('')
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState<'inbound'|'outbound'|'count'>('inbound')
  const containerId = useRef(`scanner-${Math.random().toString(36).slice(2)}`).current
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId)
    scannerRef.current = scanner
    ;(async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decoded) => setCode(decoded),
          (err) => { /* ignore scan errors */ }
        )
      } catch (e) {
        console.error('scan start error', e)
      }
    })()
    return () => { scanner.stop().catch(()=>{}); scanner.clear().catch(()=>{}) }
  }, [containerId])

  const submit = async () => {
    const r = await fetch('/api/scan/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode, warehouseCode: 'WH-A', qty })
    })
    const data = await r.json().catch(()=>({}))
    alert(JSON.stringify(data))
  }

  return (
    <div>
      <h2>Camera Scan</h2>
      <div id={containerId} style={{ width: '100%', maxWidth: 480 }} />
      <p>Code: <b>{code}</b></p>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <label>Mode</label>
        <select value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="inbound">inbound</option>
          <option value="outbound">outbound</option>
          <option value="count">count</option>
        </select>
        <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value||'1'))} />
        <button onClick={submit} disabled={!code}>Submit</button>
      </div>
    </div>
  )
}
