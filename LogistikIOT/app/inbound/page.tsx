'use client'
export default function InboundPage(){async function add(){const r=await fetch('/api/inbound/grn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sku:'BOX-001',qty:10})}); alert(await r.text())} return <button onClick={add}>Inbound GRN (BOX-001 +10)</button>}
