'use client'

import { useEffect, useRef, useState } from 'react'
import { loadHtml5Qrcode, type Html5QrcodeInstance } from '@/lib/html5qrcode-loader'

type ScanMode = 'inbound' | 'outbound' | 'count'

export default function ScanPage() {
  const [code, setCode] = useState('')
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState<ScanMode>('inbound')
  const [scanError, setScanError] = useState<string | null>(null)
  const containerId = useRef(`scanner-${Math.random().toString(36).slice(2)}`).current
  const scannerRef = useRef<Html5QrcodeInstance | null>(null)

  useEffect(() => {
    let isMounted = true

    loadHtml5Qrcode()
      .then(async (Html5Qrcode) => {
        if (!isMounted) return
        const scanner = new Html5Qrcode(containerId)
        scannerRef.current = scanner
        try {
          await scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decoded) => setCode(decoded),
            () => {
              /* ignore frame decode errors */
            }
          )
          setScanError(null)
        } catch (err) {
          console.error('scan start error', err)
          if (isMounted) {
            setScanError('Camera scanning could not be started. You can still enter codes manually below.')
          }
        }
      })
      .catch((err) => {
        console.error('html5-qrcode load error', err)
        if (isMounted) {
          setScanError('Camera scanning is unavailable in this environment. Enter codes manually below.')
        }
      })

    return () => {
      isMounted = false
      const scanner = scannerRef.current
      scannerRef.current = null
      if (scanner) {
        scanner.stop().catch(() => {})
        scanner.clear().catch(() => {})
      }
    }
  }, [containerId])

  const submit = async () => {
    const r = await fetch('/api/scan/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode, warehouseCode: 'WH-A', qty }),
    })
    const data = await r.json().catch(() => ({}))
    alert(JSON.stringify(data))
  }

  return (
    <div>
      <h2>Camera Scan</h2>
      <div id={containerId} style={{ width: '100%', maxWidth: 480 }} />
      {scanError ? (
        <p style={{ color: 'tomato' }}>{scanError}</p>
      ) : (
        <p style={{ color: '#666' }}>Point the camera at a QR or barcode to capture the code automatically.</p>
      )}
      <label style={{ display: 'block', marginBottom: 8 }}>
        Code
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code manually if scanning is unavailable"
          style={{ display: 'block', width: '100%', maxWidth: 320, marginTop: 4 }}
        />
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Mode
          <select value={mode} onChange={(e) => setMode(e.target.value as ScanMode)} style={{ marginLeft: 4 }}>
            <option value="inbound">inbound</option>
            <option value="outbound">outbound</option>
            <option value="count">count</option>
          </select>
        </label>
        <label>
          Quantity
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value || '1', 10))}
            style={{ marginLeft: 4, width: 80 }}
          />
        </label>
        <button onClick={submit} disabled={!code}>
          Submit
        </button>
      </div>
    </div>
  )
}
