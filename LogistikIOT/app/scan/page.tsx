'use client'
import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [code, setCode] = useState('')
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState<'inbound'|'outbound'|'count'>('inbound')

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    let stop = false
    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) videoRef.current.srcObject = stream
        await reader.decodeFromVideoDevice(null, videoRef.current!, (res, err) => {
          if (stop) return
          if (res) setCode(res.getText())
        })
      } catch (e) { console.error(e) }
    })()
    return () => { stop = true; reader.reset() }
  }, [])

  const submit = async () => {
    const r = await fetch('/api/scan/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code, mode, warehouseCode: 'WH-A', qty }) })
    alert(await r.text())
  }

  return (
    <div>
      <h2>Camera Scan</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width:'100%', maxWidth:480, background:'#000' }} />
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
