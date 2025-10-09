
'use client'
import { useEffect, useState } from 'react'
export default function Inventory(){
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ fetch('/api/inventory/stocks').then(r=>r.json()).then(d=>setRows(d.data||[])) },[])
  return (
    <div>
      <h2 className="text-xl mb-4">Inventory</h2>
      <table className="w-full border">
        <thead><tr className="bg-gray-50"><th className="p-2 border">Warehouse</th><th className="p-2 border">SKU</th><th className="p-2 border">Item</th><th className="p-2 border text-right">Qty</th></tr></thead>
        <tbody>{rows.map((r,i)=>(<tr key={i}><td className="p-2 border">{r.warehouse?.code}</td><td className="p-2 border">{r.item?.sku}</td><td className="p-2 border">{r.item?.name}</td><td className="p-2 border text-right">{r.qty}</td></tr>))}</tbody>
      </table>
    </div>
  )
}
