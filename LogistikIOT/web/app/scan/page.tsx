
'use client'
import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'

export default function ScanPage(){
  const videoRef = useRef<HTMLVideoElement|null>(null)
  const [result, setResult] = useState<string>('')
  const [mode, setMode] = useState<'inbound'|'outbound'|'count'>('count')
  const [warehouse, setWarehouse] = useState('WH-A')
  const [qty, setQty] = useState(1)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(()=>{
    const codeReader = new BrowserMultiFormatReader()
    let active = true
    async function start() {
      try {
        setRunning(true)
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
        if (videoRef.current) videoRef.current.srcObject = stream
        const video = videoRef.current!
        await video.play()
        while (active) {
          const res = await codeReader.decodeOnceFromVideoDevice(undefined, video)
          if (res?.getText()) {
            const code = res.getText()
            setResult(code)
            await submit(code)
          }
        }
      } catch (e:any) {
        setError(e?.message || 'Cannot access camera')
        setRunning(false)
      }
    }
    start()
    return ()=>{ active = false; codeReader.reset(); if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t=>t.stop()) }
  }, [])

  async function submit(code: string){
    const r = await fetch('/api/scan/submit', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ code, mode, warehouseCode: warehouse, qty }) })
    if (!r.ok) {
      const d = await r.json().catch(()=>({}))
      setError(d?.error || 'Submit failed')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Camera Scan</h1>
      <video ref={videoRef} className="w-full rounded border bg-black" muted playsInline />
      <div className="flex gap-2 items-center">
        <label>Mode:</label>
        <select className="border p-2" value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
          <option value="count">Cycle Count</option>
        </select>
        <input className="border p-2 w-24" value={warehouse} onChange={e=>setWarehouse(e.target.value)} placeholder="WH-A" />
        <input className="border p-2 w-20" type="number" value={qty} onChange={e=>setQty(Number(e.target.value)||1)} min={1} />
      </div>
      <div className="text-sm">Last: <span className="font-mono">{result}</span></div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {!running && <div className="text-yellow-700 text-sm">Camera not running.</div>}
      <p className="text-xs text-gray-500">Tips: iOS Safari butuh HTTPS & izin kamera. Deploy ke Vercel agar kamera aktif tanpa masalah.</p>
    </div>
  )
}
