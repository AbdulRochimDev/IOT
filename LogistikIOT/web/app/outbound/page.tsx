
'use client'
import { useEffect, useState } from 'react'
export default function Outbound(){
  const [rows, setRows] = useState<any[]>([])
  const [warehouseCode, setWh] = useState('WH-A')
  async function load(){ const r = await fetch('/api/outbound/shipments'); const d = await r.json(); setRows(d.data||[]) }
  useEffect(()=>{ load() }, [])
  async function act(number:string, action:string){
    await fetch('/api/outbound/shipments', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ number, action, warehouseCode }) })
    load()
  }
  return (<div><h2 className="text-xl mb-4">Outbound (Pick → Pack → Ship → Deliver)</h2><div className="mb-2">Warehouse: <input className="border p-1" value={warehouseCode} onChange={e=>setWh(e.target.value)} /></div><table className="w-full border"><thead><tr className="bg-gray-50"><th className="p-2 border">Shipment</th><th className="p-2 border">Status</th><th className="p-2 border">Actions</th></tr></thead><tbody>{rows.map((r:any)=>(<tr key={r.id}><td className="p-2 border">{r.number}</td><td className="p-2 border">{r.status}</td><td className="p-2 border space-x-2"><button className="border px-2" onClick={()=>act(r.number,'pick')}>Pick</button><button className="border px-2" onClick={()=>act(r.number,'pack')}>Pack</button><button className="border px-2" onClick={()=>act(r.number,'ship')}>Ship</button><button className="border px-2" onClick={()=>act(r.number,'deliver')}>Deliver</button></td></tr>))}</tbody></table></div>)
}
